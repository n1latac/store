import { IsString, IsOptional, IsNumber, IsObject, IsBoolean } from 'class-validator';

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

  @IsString({ message: 'Описание должно быть строкой' })
  @IsOptional()
  description_uk?: string;

  @IsString({ message: 'Описание должно быть строкой' })
  @IsOptional()
  description_en?: string;

  @IsBoolean({ message: 'is_deal должно быть булевым значением' })
  @IsOptional()
  is_deal?: boolean;

  @IsNumber({}, { message: 'Старая цена должна быть числом' })
  @IsOptional()
  old_price?: number;
}
