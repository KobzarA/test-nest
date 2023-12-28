import { IsDateString, IsNotEmpty, IsArray } from 'class-validator';
import { CreateOrderItemDto } from 'src/order-items/dto/create-order-item.dto';

export class CreateOrderDto {
  @IsArray()
  orderItems: CreateOrderItemDto[];

  @IsDateString()
  @IsNotEmpty()
  startBookingDate: Date;

  @IsDateString()
  @IsNotEmpty()
  endBookingDate: Date;
}
