import { IsString, IsOptional, IsNumber } from 'class-validator';

export class UpdateCategoryDto {
  @IsString({ message: 'Название должно быть строкой' })
  @IsOptional()
  name_uk?: string;

  @IsString({ message: 'Название должно быть строкой' })
  @IsOptional()
  name_en?: string;

  @IsNumber({}, { message: 'ID родительской категории должно быть числом' })
  @IsOptional()
  parent_id?: number;
}
