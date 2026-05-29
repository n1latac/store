import { IsString, IsOptional, IsNumber, IsObject } from 'class-validator';

export class UpdateProductDto {
  @IsString({ message: 'Название должно быть строкой' })
  @IsOptional()
  name_uk?: string;

  @IsString({ message: 'Название должно быть строкой' })
  @IsOptional()
  name_en?: string;

  @IsNumber({}, { message: 'Цена должна быть числом' })
  @IsOptional()
  price?: number;

  @IsNumber({}, { message: 'ID категории должно быть числом' })
  @IsOptional()
  category_id?: number;

  @IsObject({ message: 'Характеристики должны быть объектом' })
  @IsOptional()
  attributes?: Record<string, any>;

  @IsString({ message: 'Ссылка на изображение должна быть строкой' })
  @IsOptional()
  image_url?: string;
}
