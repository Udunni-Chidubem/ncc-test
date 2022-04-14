'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('transaction_log', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      farmer_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'farmer',
          key: 'id',
          name: 'farmer_id_key'
        }, 
      },
      transaction_ref : {
        type : Sequelize.STRING,
        allowNull : false,
        unique : true
      },
      currency :{
        type:Sequelize.STRING,
        allowNull : true
      },
      amount : {
        type : Sequelize.DOUBLE,
        allowNull : true,
      },
      description : {
        allowNull : true,
        type:Sequelize.TEXT
      },
      company_id : {
        type:Sequelize.INTEGER,
        allowNull : true,
        references : {
          model : 'seedcompany',
          key : 'id',
          name : 'seedcompany_id_key'
        }
      },
      status : {
        type : Sequelize.STRING,
        values: ['initiated', 'pending', 'verified'],
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
