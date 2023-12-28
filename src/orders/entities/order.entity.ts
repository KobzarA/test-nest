import { Column, Model, Table, DataType, HasMany } from 'sequelize-typescript';
import { OrderItems } from 'src/order-items/order-items.entity';

@Table
export class Order extends Model {
  @HasMany(() => OrderItems)
  orderItems: OrderItems[];

  @Column(DataType.DATEONLY)
  startBookingDate: string;

  @Column(DataType.DATEONLY)
  endBookingDate: string;
}
