import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Product } from '../../database/models/Product';
import { Category } from '../../database/models/Category';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductImage } from '../../database/models/ProductImages';
import { FilesService } from '../files/files.service';
import { Op, Sequelize } from 'sequelize';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product) private productRepo: typeof Product,
    @InjectModel(ProductImage) private productImageRepo: typeof ProductImage,
    private fileService: FilesService,
  ) {}

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

  async uploadImages(
    productId: number,
    files: Array<Express.Multer.File>,
  ): Promise<ProductImage[]> {
    const product = await this.findOne(productId);
    
    // Check if there was already a main image before uploading
    const hasMainImage = await this.productImageRepo.findOne({
      where: { product_id: productId, is_main: true }
    });

    const uploadedImages = await this.fileService.uploadMultipleProductImages(productId, files);

    if (uploadedImages.length > 0 && !hasMainImage) {
      // Set the first of the newly uploaded images as main
      const firstImage = uploadedImages[0];
      await firstImage.update({ is_main: true });
      await product.update({ image_url: firstImage.image_url });
    }

    return this.productImageRepo.findAll({
      where: { product_id: productId },
      order: [['id', 'ASC']],
    });
  }

  async removeImage(imageId: number): Promise<void> {
    const image = await this.productImageRepo.findByPk(imageId);
    if (!image) {
      throw new NotFoundException('Картинка не найдена в базе');
    }

    const productId = image.product_id;
    const wasMain = image.is_main;

    // Delete physically and from db via fileService
    await this.fileService.removeProductImage(imageId);

    // If it was the main image, we need to promote another one (if any exists)
    if (wasMain) {
      const remainingImages = await this.productImageRepo.findAll({
        where: { product_id: productId },
        order: [['id', 'ASC']],
      });

      const product = await this.productRepo.findByPk(productId);
      if (product) {
        if (remainingImages.length > 0) {
          const newMain = remainingImages[0];
          await newMain.update({ is_main: true });
          await product.update({ image_url: newMain.image_url });
        } else {
          await product.update({ image_url: null });
        }
      }
    }
  }

  async setMainImage(productId: number, imageId: number): Promise<Product> {
    const product = await this.findOne(productId);
    const targetImage = await this.productImageRepo.findOne({
      where: { id: imageId, product_id: productId },
    });

    if (!targetImage) {
      throw new NotFoundException('Изображение для данного товара не найдено');
    }

    // Set is_main = false for all other images of this product
    await this.productImageRepo.update(
      { is_main: false },
      { where: { product_id: productId } },
    );

    // Set is_main = true for the target image
    await targetImage.update({ is_main: true });

    // Update product's main image_url
    await product.update({ image_url: targetImage.image_url });

    return this.findOne(productId);
  }
}
