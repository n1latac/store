import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsObject,
  IsBoolean,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty({ message: 'Название на украинском обязательно' })
  name_uk: string;

  @IsString()
  @IsNotEmpty({ message: 'Название на английском обязательно' })
  name_en: string;

  @IsNumber()
  @IsNotEmpty({ message: 'Цена обязательна' })
  price: number;

  @IsNumber()
  @IsNotEmpty({ message: 'ID категории обязателен' })
  category_id: number;

  @IsObject()
  @IsOptional()
  attributes?: Record<string, any>; // Например: { "ram": "16GB", "color": "Black" }

  @IsString()
  @IsOptional()
  image_url?: string;

  @IsString()
  @IsOptional()
  description_uk?: string;

  @IsString()
  @IsOptional()
  description_en?: string;

  @IsBoolean()
  @IsOptional()
  is_deal?: boolean;

  @IsNumber()
  @IsOptional()
  old_price?: number;
}
