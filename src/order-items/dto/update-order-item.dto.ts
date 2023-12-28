import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { changeOrderType } from '../order-items.enum';

export class UpdateOrderItemDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  bookingObjectId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @ApiProperty()
  @IsNumber()
  id?: number;

  @ApiProperty()
  @IsNumber()
  orderId?: number;

  @ApiProperty({ enum: changeOrderType })
  @IsEnum(changeOrderType)
  action: changeOrderType;
}
