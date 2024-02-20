'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
      await queryInterface.createTable('orders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      company_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'seedcompany',
          key: 'id',
          name: 'order_company_id_key'
        }, 
      },
      transaction_log_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'transaction_log',
          key: 'id',
          name: 'order_transaction_log_key'
        }, 
      },
       status : {
        type : Sequelize.STRING,
        values: ['1', '2', '3', '4'],
        allowNull : true,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
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
