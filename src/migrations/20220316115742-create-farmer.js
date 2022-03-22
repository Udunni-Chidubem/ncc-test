'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('farmer', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      firstname: {
        type: Sequelize.STRING,
        allowNull: false
      },
      lastname: {
        type: Sequelize.STRING,
        allowNull: false
      },
      othername: {
        type: Sequelize.STRING,
        allowNull: true
      },
      product_farmed: {
        type: Sequelize.STRING,
        allowNull: true
      },
      location_of_farm: {
        type: Sequelize.STRING,
        allowNull: true
      },
      size_of_farm: {
        type: Sequelize.STRING,
        allowNull: true
      },
      phone_no: {
        type: Sequelize.STRING,
        allowNull: false
      },
      bvn: {
        type: Sequelize.STRING,
        allowNull: true
      },
      account_name: {
        type: Sequelize.STRING,
        allowNull: true
      },
      account_no : {
        type : Sequelize.STRING,
        allowNull : true
      },
      nin: {
        type: Sequelize.STRING,
        allowNull: true
      },
      age: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      gender: {
        type: Sequelize.STRING,
        allowNull: false
      },
      level_of_education: {
        type: Sequelize.STRING,
        allowNull: true
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'user',
          key: 'id',
          name: 'farmer_user_id'
        }, 
        unique : true
      },
      state_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'states',
          key: 'id'
        }
      },
      lg_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'lgas',
          key: 'id'
        }
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
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('fFarmer');
  }
};