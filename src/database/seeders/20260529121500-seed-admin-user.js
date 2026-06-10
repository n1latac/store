'use strict';
const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const existing = await queryInterface.sequelize.query(
      `SELECT id FROM users WHERE username = 'admin' LIMIT 1;`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );
    if (existing && existing.length > 0) {
      console.log('Admin user already exists, skipping...');
      return;
    }
    const hashedPassword = await bcrypt.hash('adminpassword123', 10);
    await queryInterface.bulkInsert('users', [{
      username: 'admin',
      password: hashedPassword,
      created_at: new Date(),
      updated_at: new Date(),
    }], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', { username: 'admin' }, {});
  },
};
