'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('seedProducer', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'user',
          key: 'id'
        }
      },
      full_name: {
        type: Sequelize.STRING(55),
        allowNull: false
      },
      phone_no: {
        type: Sequelize.STRING(20),
        allowNull: false,
        unique:true
      },
      certified: {
        type: Sequelize.STRING
      },
      name_of_seed: {
        type: Sequelize.STRING
      },
      variety_of_seed: {
        type: Sequelize.STRING
      },
      volume_of_seed: {
        type: Sequelize.STRING
      },
      state_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'states',
          key: 'id'
        }
      },
      lg_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'lgas',
          key: 'id'
        }
      },
      status: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0
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

  }
};
