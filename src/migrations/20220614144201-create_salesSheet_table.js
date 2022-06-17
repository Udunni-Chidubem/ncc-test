'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable('salesheets', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },

      customer_name: {
        allowNull: false,
        type: Sequelize.STRING(55)
      },
      customer_number: {
        allowNull: false,
        type: Sequelize.TEXT
      },

      product_name: {
        allowNull: false,
        type: Sequelize.JSON
      },
      product_variant: {
        allowNull: false,
        type: Sequelize.JSON
      },
      quantity: {
        allowNull: false,
        type: Sequelize.JSON
      },
     size: {
        allowNull: false,
        type: Sequelize.JSON
      },
      product_cost: {
        allowNull: false,
        type: Sequelize.JSON
      },
      sale_date: {
        allowNull: false,
        type: Sequelize.DATE
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
      community: {
        allowNull: false,
        type: Sequelize.STRING(55)
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: false,
        references: {
          model: 'user',
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
    })
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('salesheets')
  }
};
