import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/sequelize';
import { Cron } from '@nestjs/schedule';

import { CreationAttributes } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { google } from 'googleapis';

import { Product } from '../products/entities/product.entity';
import { Op } from 'sequelize';
// import { ProductSize } from '../products/entities/product-size';
// import { Size } from '../products/entities/size.entity';
// import { CreateProductDto } from '../products/dto/create-product.dto';

export interface IProduct {
  model: string;
  sku: number;
  title: string;
  sizes: string[];
  price: number;
}

export interface ProductHashTable {
  [model: string]: {
    [sku: number]: IProduct;
  };
}

//As I understand there is no need for delete products, while update. At least for now.
export interface CheckedChangedResults {
  isNeedUpdate: boolean;
  isNeedAddNew: boolean;
  productToUpdate: IProduct[];
  productToCreate: IProduct[];
}

@Injectable()
export class ParserService {
  private readonly logger = new Logger(ParserService.name);

  constructor(
    private configService: ConfigService,
    @InjectModel(Product)
    private productModel: typeof Product,
    private sequelize: Sequelize,
  ) {}
  private GOOGLE_API_KEY = this.configService.get<string>('GOOGLE_API_KEY');

  // this cron decorator will run "this.parse" method every hour at 0 minute and 0 second
  @Cron('0 0 * * * *')
  async parse() {
    this.logger.log('Started parsing data from Google Sheets');

    const hashtable = await this.parseColumnToObject();
    const checkingResult = await this.checkChanges(hashtable);
    const t = await this.sequelize.transaction();

    if (checkingResult.isNeedAddNew) {
      try {
        await this.productModel.bulkCreate(
          checkingResult.productToCreate as unknown as CreationAttributes<Product>[],
          {
            validate: true,
            transaction: t,
            // include: { model: Size, as: 'sizes' },
          },
        );
      } catch (error) {
        t.rollback();
        this.logger.error(error);
        throw error;
      }
    }

    if (checkingResult.isNeedUpdate) {
      try {
        checkingResult.productToUpdate.forEach(async (product) => {
          const productCursor = await this.productModel.findOne({
            where: { model: product.model, sku: product.sku },
            // include: { model: Size, as: 'sizes' },
          });

          productCursor.update(
            { sizes: product.sizes },
            { validate: true, transaction: t },
          );
        });
      } catch (error) {
        t.rollback();
        this.logger.error(error);
        throw error;
      }
    }

    t.commit();
    const parseResult = `Parsing finished, created ${checkingResult.productToCreate.length} and updated ${checkingResult.productToUpdate.length}`;

    this.logger.log(parseResult);
    return parseResult;
  }

  private async getSheets() {
    const sheets = await google.sheets({ version: 'v4' }).spreadsheets.get({
      auth: this.GOOGLE_API_KEY,
      spreadsheetId: '1bjqDqLZgjZSZ_fOBolseUDg7L0ktG50BlD9tAYm4rwg',
    });

    return sheets.data.sheets.map((sheet) => {
      return {
        model: sheet.properties.title,
        sheetId: sheet.properties.sheetId,
      };
    });
  }

  private async getSheetData() {
    const ranges = (await this.getSheets()).map(
      (sheet) => sheet.model + '!A:Z',
    );
    const data = await google.sheets('v4').spreadsheets.values.batchGet({
      auth: this.GOOGLE_API_KEY,
      ranges: ranges,
      spreadsheetId: '1bjqDqLZgjZSZ_fOBolseUDg7L0ktG50BlD9tAYm4rwg',
      majorDimension: 'COLUMNS',
    });

    return data.data;
  }

  private async parseColumnToObject() {
    const source = await this.getSheetData();
    const productsHashTable: ProductHashTable = {};

    source.valueRanges.forEach((range) => {
      const modelName = range.range.split("'")[1];

      range.values.forEach((column, index, arr) => {
        // skip first column with headers
        if (index === 0) return;

        const sizes = [];

        for (let i = 7; i < column.length; i++) {
          // Add only avaible sizes to array
          if (column[i]) sizes.push(arr[0][i]);
        }
        if (typeof productsHashTable[modelName] !== 'object')
          productsHashTable[modelName] = {};

        productsHashTable[modelName][column[5]] = {
          model: modelName,
          title: column[3],
          sku: column[5],
          price: column[4],
          sizes,
        };
      });
    });

    return productsHashTable;
  }

  private async checkChanges(
    productHashTable: ProductHashTable,
  ): Promise<CheckedChangedResults> {
    const result: CheckedChangedResults = {
      isNeedAddNew: false,
      isNeedUpdate: false,
      productToCreate: [],
      productToUpdate: [],
    };

    const modelList = Object.keys(productHashTable);

    const dbData = await this.productModel.findAll({
      where: {
        model: {
          [Op.or]: modelList,
        },
      },
      // include: { model: Size },
    });

    // if DB empty
    if (dbData.length === 0) {
      for (const modelName in productHashTable) {
        result.productToCreate.push(
          ...Object.values(productHashTable[modelName]),
        );
      }

      result.isNeedAddNew = true;
      return result;
    }

    dbData.forEach((product) => {
      // check if product model in db, the same as google spreadsheet sheet(list)
      if (productHashTable[product.model]) {
        //check if product is already in db
        const productHashLink = productHashTable[product.model][product.sku];
        if (productHashLink) {
          // check if sizes list in not changed
          if (product.sizes.length === productHashLink.sizes.length) {
            product.sizes.sort();
            productHashLink.sizes.sort();
            // find difference in sizes list, save to update list  quit loop
            for (let i = 0; i < product.sizes.length; i++) {
              // compare sizes
              // if (product.sizes[i].size !== productHashLink.sizes[i]) {
              if (product.sizes[i] !== productHashLink.sizes[i]) {
                result.isNeedUpdate = true;
                result.productToUpdate.push(productHashLink);
                break;
              }
            }
          }

          // above we can add another checks
          // as result we don`t need this product in our hashtable
          // I will leave there only those I need to create
          delete productHashTable[product.model][product.sku];
        }
      }
    });

    //Add products from source that doesn`t present in db

    Object.values(productHashTable).forEach((model) => {
      const productToCreate = Object.values(model);
      if (productToCreate.length) {
        result.isNeedAddNew = true;
        result.productToCreate.push(...productToCreate);
      }
    });

    return result;
  }
}
