import { Module } from '@nestjs/common';
import { BookingObjectsService } from './booking-objects.service';
import { BookingObjectsController } from './booking-objects.controller';

@Module({
  controllers: [BookingObjectsController],
  providers: [BookingObjectsService],
})
export class BookingObjectsModule {}
