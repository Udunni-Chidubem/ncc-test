'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    queryInterface.addColumn('seedtrader', 'referal_code', {
      type : Sequelize.STRING,
      unique : true,
      allowNull : true
    });
    queryInterface.addColumn('farmer', 'referee', {
      type : Sequelize.INTEGER,
      allowNull : true,
       references: {
          model: 'user',
          key: 'id',
          name: 'farmer_referee_id'
      }, 
    })
    queryInterface.addColumn('transaction_log', 'seedtrader_id',{
      type : Sequelize.INTEGER,
        references: {
          model: 'seedtrader',
          key: 'id',
          name: 'seedtrader_transaction_id'
        }, 
    })
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
