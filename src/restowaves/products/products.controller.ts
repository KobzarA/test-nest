import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiTags, ApiOperation, ApiBadRequestResponse } from '@nestjs/swagger';
import { QueryProductDto } from './dto/query-product.dto';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }
  @ApiOperation({
    description: `Here you can get all products.
    To use several values for one query param You need to separate this value with
    
        //      (without spaces)

    For example: brand : Nike//Adidas or sizes: 36//37
    `,
  })
  @Get()
  findAll(@Query() query?: QueryProductDto) {
    return this.productsService.findAll(query);
  }

  @ApiBadRequestResponse({
    schema: {
      example: `{
  "message": "Product with id #15 not exist, cann't complete delete action, please refresh page and try again",
  "error": "Bad Request",
  "statusCode": 400
}`,
    },
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @ApiBadRequestResponse({
    schema: {
      example: `{
  "message": "Product with id #15 not exist",
  "error": "Bad Request",
  "statusCode": 400
}`,
    },
  })
  @ApiOperation({
    description: `Here you can update only those properties you want to update.
    
    For this send those new property key-value pairs.
  `,
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(+id, updateProductDto);
  }

  @ApiBadRequestResponse({
    schema: {
      example: `{
  "message": "Product with id #15 not exist",
  "error": "Bad Request",
  "statusCode": 400
}`,
    },
  })
  @Patch('update-title/:id')
  updateName(@Param('id') id: string, @Body('title') title: string) {
    return this.productsService.updateName(+id, title);
  }

  @ApiBadRequestResponse({
    schema: {
      example: `{
  "message": "Product with id #15 not exist, cann't complete delete action, please refresh page and try again",
  "error": "Bad Request",
  "statusCode": 400
}`,
    },
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}
