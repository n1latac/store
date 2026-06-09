import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Product } from '../../database/models/Product';
import { Category } from '../../database/models/Category';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Op, Sequelize } from 'sequelize';

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

  async findAll(options?: {
    filters?: Record<string, any>;
    search?: string;
    categoryId?: number;
    page?: number;
    limit?: number;
  }): Promise<{ rows: Product[]; count: number } | Product[]> {
    const whereClause: any = {};

    // Если передали фильтры, добавляем магию JSONB
    if (options?.filters && Object.keys(options.filters).length > 0) {
      whereClause.attributes = {
        [Op.contains]: options.filters,
      };
    }

    if (options?.categoryId) {
      // Ищем все подкатегории, чтобы также отфильтровать по ним
      const categoryIds = [options.categoryId];
      try {
        const subCats = await Category.findAll({
          where: { parent_id: options.categoryId },
          attributes: ['id'],
        });
        subCats.forEach((sc) => categoryIds.push(sc.id));
      } catch (err) {
        console.error('Failed to fetch subcategories:', err);
      }
      
      whereClause.category_id = {
        [Op.in]: categoryIds,
      };
    }

    if (options?.search) {
      const searchLower = options.search.toLowerCase().trim();
      const searchPattern = `%${searchLower}%`;

      whereClause[Op.or] = [
        Sequelize.where(
          Sequelize.fn(
            'lower',
            Sequelize.fn(
              'translate',
              Sequelize.col('Product.name_uk'),
              'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯІЄЇҐ',
              'абвгдеёжзийклмнопрстуфхцчшщъыьэюяієїґ'
            )
          ),
          { [Op.like]: searchPattern }
        ),
        Sequelize.where(
          Sequelize.fn(
            'lower',
            Sequelize.fn(
              'translate',
              Sequelize.col('Product.name_en'),
              'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯІЄЇҐ',
              'абвгдеёжзийклмнопрстуфхцчшщъыьэюяієїґ'
            )
          ),
          { [Op.like]: searchPattern }
        ),
        Sequelize.where(
          Sequelize.fn(
            'lower',
            Sequelize.fn(
              'translate',
              Sequelize.col('category.name_uk'),
              'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯІЄЇҐ',
              'абвгдеёжзийклмнопрстуфхцчшщъыьэюяієїґ'
            )
          ),
          { [Op.like]: searchPattern }
        ),
        Sequelize.where(
          Sequelize.fn(
            'lower',
            Sequelize.fn(
              'translate',
              Sequelize.col('category.name_en'),
              'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯІЄЇҐ',
              'абвгдеёжзийклмнопрстуфхцчшщъыьэюяієїґ'
            )
          ),
          { [Op.like]: searchPattern }
        ),
      ];
    }

    const queryOptions: any = {
      where: whereClause,
      include: [
        { association: 'category' },
        { association: 'images' }
      ],
      order: [['id', 'DESC']], // Свежие товары сверху
      subQuery: false,
    };

    if (options?.page && options?.limit) {
      queryOptions.limit = options.limit;
      queryOptions.offset = (options.page - 1) * options.limit;

      const { rows, count } = await this.productRepo.findAndCountAll(queryOptions);
      return { rows, count };
    }

    return this.productRepo.findAll(queryOptions);
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
