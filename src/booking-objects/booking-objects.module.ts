import { Module } from '@nestjs/common';
import { BookingObjectsService } from './booking-objects.service';
import { BookingObjectsController } from './booking-objects.controller';
import { BookingObject } from './entities/booking-object.entity';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports: [SequelizeModule.forFeature([BookingObject])],
  controllers: [BookingObjectsController],
  providers: [BookingObjectsService],
})
export class BookingObjectsModule {}
