import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Product } from '../../database/models/Product';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Op } from 'sequelize';

@Injectable()
export class ProductsService {
  constructor(@InjectModel(Product) private productRepo: typeof Product) {}

  async create(dto: CreateProductDto): Promise<Product> {
    return this.productRepo.create(dto as any);
  }

  async update(id: number, dto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id);
    await product.update(dto as any);
    return product;
  }

  async findAll(filters?: Record<string, any>): Promise<Product[]> {
    const whereClause: any = {};

    // Если передали фильтры, добавляем магию JSONB
    if (filters && Object.keys(filters).length > 0) {
      whereClause.attributes = {
        [Op.contains]: filters,
      };
    }

    return this.productRepo.findAll({
      where: whereClause,
      include: [
        { association: 'category' },
        { association: 'images' }
      ], // Сразу приклеиваем категорию и галерею картинок
    });
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepo.findByPk(id, {
      include: [
        { association: 'category' },
        { association: 'images' }
      ],
    });
    if (!product) {
      throw new NotFoundException(`Товар с ID ${id} не найден`);
    }
    return product;
  }

  async remove(id: number): Promise<void> {
    const product = await this.findOne(id);
    await product.destroy();
  }
}
