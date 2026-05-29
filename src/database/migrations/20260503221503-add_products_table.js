'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('products', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name_uk: { type: Sequelize.STRING, allowNull: true },
      name_en: { type: Sequelize.STRING, allowNull: true },
      price: { type: Sequelize.DECIMAL(10, 2), allowNull: true },
      image_url: { type: Sequelize.TEXT, allowNull: true },
      attributes: { type: Sequelize.JSONB, defaultValue: {} },

      category_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      created_at: { allowNull: true, type: Sequelize.DATE },
      updated_at: { allowNull: true, type: Sequelize.DATE },
    });

    await queryInterface.addIndex('products', ['attributes'], {
      name: 'idx_products_attributes_gin',
      using: 'GIN',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('products');
  },
};
