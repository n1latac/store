'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Добавляем колонки описания в таблицу products
    await queryInterface.addColumn('products', 'description_uk', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.addColumn('products', 'description_en', {
      type: Sequelize.TEXT,
      allowNull: true,
    });

    // 2. Делаем первую картинку главной для товаров, у которых есть картинки, но ни одна не помечена как is_main
    await queryInterface.sequelize.query(`
      UPDATE product_images
      SET is_main = true
      WHERE id IN (
        SELECT MIN(pi.id)
        FROM product_images pi
        LEFT JOIN (
          SELECT DISTINCT product_id
          FROM product_images
          WHERE is_main = true
        ) m ON pi.product_id = m.product_id
        WHERE m.product_id IS NULL
        GROUP BY pi.product_id
      );
    `);

    // 3. Синхронизируем колонку image_url в таблице products с главной картинкой из product_images
    await queryInterface.sequelize.query(`
      UPDATE products p
      SET image_url = pi.image_url
      FROM product_images pi
      WHERE p.id = pi.product_id 
        AND pi.is_main = true 
        AND (p.image_url IS NULL OR p.image_url != pi.image_url);
    `);
  },

  async down(queryInterface, Sequelize) {
    // Удаляем колонки описания при откате
    await queryInterface.removeColumn('products', 'description_uk');
    await queryInterface.removeColumn('products', 'description_en');
  }
};
