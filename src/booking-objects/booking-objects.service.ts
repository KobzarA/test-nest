import { Injectable } from '@nestjs/common';
import { CreateBookingObjectDto } from './dto/create-booking-object.dto';
import { UpdateBookingObjectDto } from './dto/update-booking-object.dto';

@Injectable()
export class BookingObjectsService {
  create(createBookingObjectDto: CreateBookingObjectDto) {
    return 'This action adds a new bookingObject';
  }

  findAll() {
    return `This action returns all bookingObjects`;
  }

  findOne(id: number) {
    return `This action returns a #${id} bookingObject`;
  }

  update(id: number, updateBookingObjectDto: UpdateBookingObjectDto) {
    return `This action updates a #${id} bookingObject`;
  }

  remove(id: number) {
    return `This action removes a #${id} bookingObject`;
  }
}
