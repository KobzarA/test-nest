import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
// import { CreateSizeDto } from './create-size.dto';

export class CreateProductDto {
  @IsNotEmpty()
  model: string;

  @IsNumber()
  @IsNotEmpty()
  sku: number;

  @IsNotEmpty()
  title: string;

  @IsNumber()
  price: number;

  @IsString({ each: true })
  sizes: string[];

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  subcategory?: string;

  @IsOptional()
  @IsString()
  brand?: string;

  // @IsArray()
  // sizes: CreateSizeDto[];
  // @IsArray()
}
