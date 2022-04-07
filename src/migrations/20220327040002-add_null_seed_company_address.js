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
      queryInterface.changeColumn(
        'seedcompany',
        'address',
        {
          type: Sequelize.TEXT,
          allowNull: true
        }
      ),

      queryInterface.changeColumn(
        'seedtrader',
        'state_id',
        {
          type: Sequelize.INTEGER,
          allowNull: true
        }
      ),

      queryInterface.changeColumn(
        'seedtrader',
        'lg_id',
        {
          type: Sequelize.INTEGER,
          allowNull: true
        }
      )
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
