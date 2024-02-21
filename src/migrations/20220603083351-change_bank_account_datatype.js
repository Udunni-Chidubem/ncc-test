'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    //  await queryInterface.changeColumn('seedtrader', 'bank_account_no', {
    //   type : Sequelize.BIGINT.UNSIGNED,
    //   allowNull : true
    // });
    // await queryInterface.changeColumn('seedcompany', 'bank_account_no', {
    //   type : Sequelize.BIGINT.UNSIGNED,
    //   allowNull : true
    // });
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
