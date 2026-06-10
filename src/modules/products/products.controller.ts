import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Patch,
  Query,
  UploadedFiles,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FilesService } from '../files/files.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private fileService: FilesService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() dto: CreateProductDto) {
    return this.productsService.create(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.productsService.update(+id, dto);
  }

  @Get()
  getAll(
    @Query('filters') filters?: string,
    @Query('search') search?: string,
    @Query('category_id') categoryId?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    let parsedFilters = {};
    if (filters) {
      try {
        parsedFilters = JSON.parse(filters); // Превращаем строку из URL в объект
      } catch (error) {
        // Если прислали кривой JSON, просто игнорируем
      }
    }
    return this.productsService.findAll({
      filters: parsedFilters,
      search,
      categoryId: categoryId ? +categoryId : undefined,
      page: page ? +page : undefined,
      limit: limit ? +limit : undefined,
    });
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }

  @Post(':id/images') // Сделали множественное число в URL для красоты
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor('images', 10)) // 'images' - ключ в form-data, 10 - максимальное кол-во файлов за раз
  uploadImages(
    @Param('id') id: string,
    @UploadedFiles() files: Array<Express.Multer.File>, // <-- Теперь это массив!
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('Файлы не предоставлены');
    }
    // Передаем массив в сервис
    return this.productsService.uploadImages(+id, files);
  }

  @Delete('image/:imageId')
  @UseGuards(JwtAuthGuard)
  removeImage(@Param('imageId') imageId: string) {
    return this.productsService.removeImage(+imageId);
  }

  @Patch(':productId/image/:imageId/main')
  @UseGuards(JwtAuthGuard)
  setMainImage(
    @Param('productId') productId: string,
    @Param('imageId') imageId: string,
  ) {
    return this.productsService.setMainImage(+productId, +imageId);
  }
}
