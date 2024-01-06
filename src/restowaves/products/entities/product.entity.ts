import { ApiProperty } from '@nestjs/swagger';
import { DataTypes } from 'sequelize';
import {
  // BelongsToMany,
  Column,
  // ForeignKey,
  // HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
// import { Size } from './size.entity';
// import { ProductSize } from './product-size';
// import { Size } from './size.entity';

@Table
export class Product extends Model {
  @Column
  title: string;

  @Column
  model: string;

  @Column
  price: number;

  //can be repeated in diffrent models
  @Column
  sku: number;

  // @ForeignKey(() =>)
  // categoryId: number;
  @Column({ defaultValue: 'sport' })
  category: string;

  @Column
  subcategory: string;

  @Column
  brand: string;

  @ApiProperty({ type: [String] })
  @Column(DataTypes.ARRAY(DataTypes.STRING))
  sizes: string[];

  // @ApiProperty({ type: [Number] })
  // @BelongsToMany(() => Size, () => ProductSize)
  // sizes: Size[];
}
