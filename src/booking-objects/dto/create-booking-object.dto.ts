import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { BookingObjectType } from '../booking-objects.enum';

export class CreateBookingObjectDto {
  @IsEnum(BookingObjectType)
  @IsNotEmpty()
  objectType: BookingObjectType;

  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  available: number;

  @IsNotEmpty()
  @IsNumber()
  price: number;
}
