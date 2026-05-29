import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Product } from './Product';

@Table({
  tableName: 'product_images',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class ProductImage extends Model<ProductImage> {
  @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
  id: number;

  @Column({ allowNull: false, type: DataType.TEXT })
  image_url: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  is_main: boolean;

  @ForeignKey(() => Product)
  @Column({ type: DataType.INTEGER, allowNull: false })
  product_id: number;

  @BelongsTo(() => Product)
  product: Product;
}
