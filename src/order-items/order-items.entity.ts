import {
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { BookingObject } from 'src/booking-objects/entities/booking-object.entity';
import { Order } from 'src/orders/entities/order.entity';

@Table
export class OrderItems extends Model {
  @ForeignKey(() => Order)
  @Column
  orderId: number;

  @ForeignKey(() => BookingObject)
  @Column
  bookingObjectId: number;

  @BelongsTo(() => BookingObject)
  bookingObject: BookingObject;

  @Column
  quantity: number;
}
