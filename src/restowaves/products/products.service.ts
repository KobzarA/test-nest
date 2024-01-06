import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Product } from './entities/product.entity';
import { QueryProductDto } from './dto/query-product.dto';
import { Op } from 'sequelize';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product)
    private productModel: typeof Product,
  ) {}

  async create(createProductDto: CreateProductDto) {
    return this.productModel.create({ ...createProductDto });
  }

  async findAll(query?: QueryProductDto) {
    const where: Partial<Record<keyof QueryProductDto, any>> = {};

    // loop over query param and transform it
    for (const key in query) {
      if (key === 'sizes') {
        where[key] = {
          [Op.overlap]: query[key].split('//'),
        };

        continue;
      }

      where[key] = query[key].split('//');
    }

    return this.productModel.findAll({ where });
  }

  async findOne(id: number) {
    const product = await this.productModel.findOne({ where: { id } });
    if (!product) throw new BadRequestException(`Product with ${id} not exist`);

    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.productModel.findOne({ where: { id } });
    if (!product) throw new BadRequestException(`Product with ${id} not exist`);

    product.update({ ...updateProductDto });
    return product;
  }

  async remove(id: number) {
    const product = await this.productModel.findOne({ where: { id } });
    if (!product)
      throw new BadRequestException(
        `Product with id #${id} not exist, cann't complete delete action, please refresh page and try again`,
      );
    product.destroy();
    return {
      message: `Product with id #${id} succesfully removed`,
      statusCode: 200,
    };
  }

  async updateName(id: number, updateTitle: string) {
    const product = await this.productModel.findOne({ where: { id } });
    if (!product) throw new BadRequestException(`Product with ${id} not exist`);

    product.update({ title: updateTitle });
    return product;
  }
}
