import { BadRequestException, Injectable } from '@nestjs/common';
import { Category } from '../../database/models/Category';
import { InjectModel } from '@nestjs/sequelize';
import { Product } from '../../database/models/Product';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category) private categoryRepo: typeof Category,
    @InjectModel(Product) private productRepo: typeof Product,
  ) {}

  async create(dto: CreateCategoryDto): Promise<Category> {
    return this.categoryRepo.create(dto as any);
  }

  async update(id: number, dto: UpdateCategoryDto): Promise<Category> {
    const category = await this.categoryRepo.findByPk(id);
    if (!category) {
      throw new BadRequestException('Категория не найдена');
    }
    await category.update(dto as any);
    return category;
  }

  async findAll(): Promise<Category[]> {
    return this.categoryRepo.findAll({ include: { association: 'products' } });
  }

  async remove(id: number): Promise<void> {
    const category = await this.categoryRepo.findByPk(id);
    if (!category) {
      throw new BadRequestException('Категория не найдена');
    }

    // 1. Проверяем, есть ли товары в этой категории
    const productsCount = await this.productRepo.count({
      where: { category_id: id },
    });

    if (productsCount > 0) {
      // Блокируем удаление на уровне кода NestJS!
      throw new BadRequestException(
        `Нельзя удалить категорию! В ней находится ${productsCount} товаров.`,
      );
    }

    // 2. Если товаров нет - смело удаляем
    await category.destroy();
  }
}
