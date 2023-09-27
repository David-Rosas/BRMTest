'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('roles', [
      {
        name: 'administrator',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'customer',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('roles', null, {});
  },
};
