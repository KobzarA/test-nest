import { PartialType } from '@nestjs/mapped-types';
import { IsDateString, IsNotEmpty, IsArray } from 'class-validator';

import { CreateOrderDto } from './create-order.dto';
import { UpdateOrderItemDto } from 'src/order-items/dto/update-order-item.dto';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
  @IsArray()
  orderItems?: UpdateOrderItemDto[];

  @IsDateString()
  @IsNotEmpty()
  startBookingDate: Date;

  @IsDateString()
  @IsNotEmpty()
  endBookingDate: Date;
}
