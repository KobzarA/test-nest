import { PartialType } from '@nestjs/mapped-types';
import { CreateBookingObjectDto } from './create-booking-object.dto';
import { IsString, IsEnum, IsNumber } from 'class-validator';
import { BookingObjectType } from '../booking-objects.enum';

export class UpdateBookingObjectDto extends PartialType(
  CreateBookingObjectDto,
) {
  @IsEnum(BookingObjectType)
  objectType: BookingObjectType;

  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsNumber()
  available: number;

  @IsNumber()
  price: number;
}
