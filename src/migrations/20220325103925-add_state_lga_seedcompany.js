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
      queryInterface.addColumn('seedcompany', 'state_id', {
        type: Sequelize.INTEGER,
        references: {
          model: 'states',
          key: 'id'
        }
      }),
      queryInterface.addColumn('seedcompany', 'lg_id', {
        type: Sequelize.INTEGER,
        references: {
          model: 'lgas',
          key: 'id'
        }
      }),
    ];
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
     return [
      queryInterface.dropColumn('seedcompany', 'state_id'),
      queryInterface.dropColumn('seedcompany', 'lg_id'),
    ];
  }
};
