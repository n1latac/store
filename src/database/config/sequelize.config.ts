import { SequelizeModuleOptions } from '@nestjs/sequelize';
import { ConfigService } from '@nestjs/config';
import { Product } from '../models/Product';
import { Category } from '../models/Category';
import { ProductImage } from '../models/ProductImages';
import { User } from '../models/User';

const models = [Product, Category, ProductImage, User];

export const getSequelizeConfig = (
  configService: ConfigService,
): SequelizeModuleOptions => ({
  dialect: 'postgres',
  host: configService.get('DB_HOST'),
  port: configService.get('DB_PORT'),
  username: configService.get('DB_USER'),
  password: configService.get('DB_PASSWORD'),
  database: configService.get('DB_NAME'),
  models: [...models],
  autoLoadModels: true,
  synchronize: false,
});
