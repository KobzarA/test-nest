import { IsNumber } from 'class-validator';

export class CreateSizeDto {
  @IsNumber()
  size: number;
}
