import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  HttpCode,
} from '@nestjs/common';
import { BookingObjectsService } from './booking-objects.service';
import { CreateBookingObjectDto } from './dto/create-booking-object.dto';
import { UpdateBookingObjectDto } from './dto/update-booking-object.dto';
import { ApiBody, ApiTags } from '@nestjs/swagger';

@ApiTags('Booking objects')
@Controller('booking-objects')
export class BookingObjectsController {
  constructor(private readonly bookingObjectsService: BookingObjectsService) {}

  @ApiBody({
    type: CreateBookingObjectDto,
    description:
      'To create object you should choose one of this objectTypes: hotelRoom, car, apartment',
  })
  @Post()
  create(@Body() createBookingObjectDto: CreateBookingObjectDto) {
    return this.bookingObjectsService.create(createBookingObjectDto);
  }

  @Get()
  findAll() {
    return this.bookingObjectsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookingObjectsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateBookingObjectDto: UpdateBookingObjectDto,
  ) {
    return this.bookingObjectsService.update(+id, updateBookingObjectDto);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id', new ParseIntPipe()) id: string) {
    return this.bookingObjectsService.remove(+id);
  }
}
