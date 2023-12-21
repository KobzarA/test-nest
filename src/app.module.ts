import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BookingObjectsModule } from './booking-objects/booking-objects.module';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [BookingObjectsModule, OrdersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
