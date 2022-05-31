'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
     await queryInterface.addColumn('seedtrader', 'gender', {
      type : Sequelize.STRING,
      allowNull : true,
    });
    await queryInterface.addColumn('seedtrader', 'level_of_education', {
      type : Sequelize.STRING,
      allowNull : true,
    });
    await queryInterface.addColumn('seedtrader', 'bank_account_name', {
      type : Sequelize.STRING,
      allowNull : true
    });
    await queryInterface.addColumn('seedtrader', 'bank_account_no', {
      type : Sequelize.INTEGER(10),
      allowNull : true
    });
    await queryInterface.addColumn('seedtrader', 'bank_code', {
      type : Sequelize.STRING,
      allowNull : true,
    });
    await queryInterface.addColumn('seedtrader', 'profile_pic', {
      type : Sequelize.TEXT,
      allowNull : true
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
