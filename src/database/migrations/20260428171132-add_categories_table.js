'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('categories', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name_uk: { type: Sequelize.STRING, allowNull: true },
      name_en: { type: Sequelize.STRING, allowNull: true },
      parent_id: { type: Sequelize.INTEGER, allowNull: true },
      created_at: { allowNull: true, type: Sequelize.DATE },
      updated_at: { allowNull: true, type: Sequelize.DATE },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('categories');
  },
};
