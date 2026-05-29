import { Column, DataType, Model, Table, HasMany } from 'sequelize-typescript';
import { Product } from './Product';

@Table({
  tableName: 'categories',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class Category extends Model<Category> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  name_uk: string;

  @Column({ type: DataType.STRING, allowNull: true })
  name_en: string;

  // Для создания подкатегорий (Дерево). Если null - это главная категория
  @Column({ type: DataType.INTEGER, allowNull: true })
  parent_id: number;

  // Sequelize магия: Указываем, что у одной категории может быть много товаров
  @HasMany(() => Product)
  products: Product[];
}
