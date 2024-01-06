import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Product } from './entities/product.entity';
// import { Size } from './entities/size.entity';
// import { ProductSize } from './entities/product-size';

@Module({
  // imports: [SequelizeModule.forFeature([Product, Size, ProductSize])],
  imports: [SequelizeModule.forFeature([Product])],

  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [SequelizeModule],
})
export class ProductsModule {}
