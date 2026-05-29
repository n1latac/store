import { Global, Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProductImage } from '../../database/models/ProductImages';

@Global()
@Module({
  imports: [SequelizeModule.forFeature([ProductImage])],
  providers: [FilesService],
  exports: [FilesService],
})
export class FilesModule {}
