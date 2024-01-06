import { BelongsTo, ForeignKey, Model, Table } from 'sequelize-typescript';
import { Product } from './product.entity';
import { Size } from './size.entity';

@Table
export class ProductSize extends Model {
  @ForeignKey(() => Size)
  sizeId: string;

  @ForeignKey(() => Product)
  productId: string;

  // @BelongsTo(() => Size)
  // size: Size;

  // @BelongsTo(() => Product, {})
  // product: Product;
}
