import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { SequelizeModule } from '@nestjs/sequelize';
import * as Joi from 'joi';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { BookingObjectsModule } from './booking-objects/booking-objects.module';
import { OrdersModule } from './orders/orders.module';
import { RestowavesModule } from './restowaves/restowaves.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test', 'provision')
          .default('development'),
        PORT: Joi.number().default(3000),
        PG_PASSWORD: Joi.required(),
        PG_USER: Joi.required(),
        PG_HOST: Joi.required(),
        PG_PORT: Joi.number().default(5432),
        PG_DBNAME: Joi.required(),
        GOOGLE_API_KEY: Joi.required(),
      }),
    }),
    ScheduleModule.forRoot(),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.PG_HOST,
      port: +process.env.PG_PORT,
      username: process.env.PG_USER,
      password: process.env.PG_PASSWORD,
      database: process.env.PG_DBNAME,
      autoLoadModels: true,
      synchronize: true,
      // models: [BookingObject],
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      },
    }),
    BookingObjectsModule,
    OrdersModule,
    RestowavesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
