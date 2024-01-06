import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { ParserModule } from './parser/parser.module';
import { RouterModule } from '@nestjs/core';

@Module({
  imports: [
    ProductsModule,
    ParserModule,
    RouterModule.register([
      {
        path: '/restowaves',
        module: RestowavesModule,
        children: [
          { path: '/', module: ProductsModule },
          { path: '/', module: ParserModule },
        ],
      },
    ]),
  ],
})
export class RestowavesModule {}
