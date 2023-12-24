import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BookingObject } from './entities/booking-object.entity';
import { CreateBookingObjectDto } from './dto/create-booking-object.dto';
import { UpdateBookingObjectDto } from './dto/update-booking-object.dto';

@Injectable()
export class BookingObjectsService {
  constructor(
    @InjectModel(BookingObject)
    private bookingModel: typeof BookingObject,
  ) {}
  create(createBookingObjectDto: CreateBookingObjectDto) {
    return this.bookingModel.create({ ...createBookingObjectDto });
  }

  async findAll(): Promise<BookingObject[]> {
    return this.bookingModel.findAll();
  }

  async findOne(id: number) {
    const object = await this.bookingModel.findOne({
      where: {
        id,
      },
    });
    if (object === null) {
      throw new NotFoundException('Object doesn`t exist');
    } else {
      return object;
    }
  }

  async update(id: number, updateBookingObjectDto: UpdateBookingObjectDto) {
    const object = await this.findOne(id);
    object.update({ ...updateBookingObjectDto });

    return object;
  }

  async remove(id: number): Promise<void> {
    const object = await this.findOne(id);
    await object.destroy();
  }
}
