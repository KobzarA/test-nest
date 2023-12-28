import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Order } from './entities/order.entity';
import { BookingObjectsModule } from 'src/booking-objects/booking-objects.module';
import { OrderItems } from 'src/order-items/order-items.entity';

@Module({
  imports: [
    SequelizeModule.forFeature([Order, OrderItems]),
    BookingObjectsModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
