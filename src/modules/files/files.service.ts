import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import { ProductImage } from '../../database/models/ProductImages';
import { InjectModel } from '@nestjs/sequelize';
import sharp from 'sharp';

@Injectable()
export class FilesService {
  private s3Client: S3Client;

  constructor(
    private configService: ConfigService,
    @InjectModel(ProductImage)
    private readonly productImageRepo: typeof ProductImage,
  ) {
    this.s3Client = new S3Client({
      region: this.configService.get('S3_REGION'),
      endpoint: this.configService.get('S3_ENDPOINT'),
      credentials: {
        accessKeyId: this.configService.get('S3_ACCESS_KEY'),
        secretAccessKey: this.configService.get('S3_SECRET_KEY'),
      },
    });
  }

  private async compressImage(
    file: Express.Multer.File,
  ): Promise<{ buffer: Buffer; fileName: string; mimetype: string }> {
    // Если это не картинка или это гифка (которую мы не хотим ломать), возвращаем как есть
    if (!file.mimetype.startsWith('image/') || file.mimetype === 'image/gif') {
      const fileName = `${uuidv4()}${path.extname(file.originalname)}`;
      return { buffer: file.buffer, fileName, mimetype: file.mimetype };
    }

    try {
      // Сжимаем изображение с помощью sharp:
      // - Ограничиваем максимальную ширину/высоту в 1200px без растягивания меньших картинок
      // - Конвертируем в формат WebP с качеством 82% (идеальный баланс без визуальных потерь)
      const compressedBuffer = await sharp(file.buffer)
        .resize({
          width: 1200,
          height: 1200,
          fit: 'inside',
          withoutEnlargement: true,
        })
        .webp({ quality: 82 })
        .toBuffer();

      const fileName = `${uuidv4()}.webp`;
      return {
        buffer: compressedBuffer,
        fileName,
        mimetype: 'image/webp',
      };
    } catch (err) {
      console.error('Ошибка сжатия изображения с помощью sharp, загружаем оригинал:', err);
      // В случае сбоя возвращаем оригинальный файл, чтобы загрузка не сломалась
      const fileName = `${uuidv4()}${path.extname(file.originalname)}`;
      return { buffer: file.buffer, fileName, mimetype: file.mimetype };
    }
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    try {
      const { buffer, fileName, mimetype } = await this.compressImage(file);

      await this.s3Client.send(
        new PutObjectCommand({
          Bucket: this.configService.get('S3_BUCKET_NAME'),
          Key: fileName,
          Body: buffer,
          ContentType: mimetype,
        }),
      );

      return `${this.configService.get('S3_PUBLIC_URL')}/${fileName}`;
    } catch (e) {
      throw new InternalServerErrorException('Ошибка загрузки в R2');
    }
  }

  async uploadMultipleProductImages(
    productId: number,
    files: Array<Express.Multer.File>,
  ): Promise<ProductImage[]> {
    try {
      // 1. Создаем массив задач (Promises) для параллельной загрузки в S3
      const uploadPromises = files.map(async (file) => {
        const { buffer, fileName, mimetype } = await this.compressImage(file);

        await this.s3Client.send(
          new PutObjectCommand({
            Bucket: this.configService.get('S3_BUCKET_NAME'),
            Key: fileName,
            Body: buffer,
            ContentType: mimetype,
          }),
        );

        const imageUrl = `${this.configService.get('S3_PUBLIC_URL')}/${fileName}`;

        // Возвращаем объект для записи в базу
        return {
          product_id: productId,
          image_url: imageUrl,
          is_main: false,
        };
      });

      // 2. Ждем, пока ВСЕ файлы загрузятся в Cloudflare R2
      const imagesData = await Promise.all(uploadPromises);

      // 3. Массово сохраняем все ссылки в базу данных одним SQL-запросом
      return await this.productImageRepo.bulkCreate(imagesData as any[]);
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException(
        'Ошибка при массовой загрузке файлов',
      );
    }
  }

  async removeProductImage(imageId: number): Promise<void> {
    const image = await this.productImageRepo.findByPk(imageId);
    if (!image) {
      throw new NotFoundException('Картинка не найдена в базе');
    }

    try {
      // Извлекаем имя файла из URL (последняя часть после слэша)
      const fileName = image.image_url.split('/').pop();

      // 1. Удаляем физический файл из S3
      await this.s3Client.send(
        new DeleteObjectCommand({
          Bucket: this.configService.get('S3_BUCKET_NAME'),
          Key: fileName,
        }),
      );

      // 2. Удаляем запись из БД
      await image.destroy();
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException(
        'Ошибка при удалении файла из хранилища',
      );
    }
  }
}
