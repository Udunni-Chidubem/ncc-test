'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.removeColumn('seedProducer', 'gender');

    await queryInterface.addColumn('seedProducer', 'gender', {
        type: Sequelize.STRING,
        allowNull: true,
      
      });
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
