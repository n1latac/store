import {
  Column,
  DataType,
  Model,
  Table,
  ForeignKey,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';
import { Category } from './Category';
import { ProductImage } from './ProductImages';

@Table({
  tableName: 'products',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      name: 'idx_products_attributes_gin',
      fields: ['attributes'],
      using: 'GIN', // Индекс для быстрого поиска по JSON
    },
  ],
})
export class Product extends Model<Product> {
  @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
  id: number;

  @Column({ allowNull: false, type: DataType.STRING })
  name_uk: string;

  @Column({ allowNull: true, type: DataType.STRING })
  name_en: string;

  @Column({ allowNull: false, type: DataType.DECIMAL(10, 2) })
  price: number;

  @Column({ type: DataType.TEXT })
  image_url: string;

  @Column({ type: DataType.JSONB, defaultValue: {} })
  attributes: Record<string, any>;

  // --- СВЯЗЬ С КАТЕГОРИЕЙ --- //

  // Физическая колонка в базе данных
  @ForeignKey(() => Category)
  @Column({ type: DataType.INTEGER, allowNull: false })
  category_id: number;

  // Виртуальное поле для NestJS (чтобы подтягивать объект категории)
  @BelongsTo(() => Category)
  category: Category;

  @HasMany(() => ProductImage)
  images: ProductImage[];
}
