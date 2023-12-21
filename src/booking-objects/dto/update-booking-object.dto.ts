import { PartialType } from '@nestjs/mapped-types';
import { CreateBookingObjectDto } from './create-booking-object.dto';

export class UpdateBookingObjectDto extends PartialType(CreateBookingObjectDto) {}
