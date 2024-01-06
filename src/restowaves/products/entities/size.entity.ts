import {
  BelongsToMany,
  Column,
  Model,
  Table,
  Unique,
} from 'sequelize-typescript';
import { Product } from './product.entity';
import { ProductSize } from './product-size';

@Table
export class Size extends Model {
  @Unique
  @Column
  size: number;

  @BelongsToMany(() => Product, () => ProductSize)
  products: Product[];
}
