import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty({ message: 'Название на украинском обязательно' })
  name_uk: string;

  @IsString()
  @IsOptional()
  name_en?: string;

  @IsNumber()
  @IsOptional()
  parent_id?: number;
}
