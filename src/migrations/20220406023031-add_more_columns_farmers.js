'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
     return [
      queryInterface.addColumn('farmer', 'source_type', {
        type: Sequelize.STRING,
      }),
      queryInterface.addColumn('farmer', 'address_of_farm', {
        type: Sequelize.TEXT,
      }),
      queryInterface.addColumn('farmer', 'farm_size', {
        type: Sequelize.TEXT,
      })
    ];
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
