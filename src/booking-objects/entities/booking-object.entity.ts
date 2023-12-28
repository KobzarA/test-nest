import { Column, Model, PrimaryKey, Table } from 'sequelize-typescript';
import { BookingObjectType } from '../booking-objects.enum';

@Table
export class BookingObject extends Model {
  //TODO Make id visible in Swagger Response doc
  // @PrimaryKey
  // @Column
  // id: number;

  @Column
  objectType: BookingObjectType;

  @Column
  title: string;

  @Column
  description: string;

  @Column
  available: number;

  @Column
  price: number;
}
