'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable('contact', {
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
      email : {
        type : Sequelize.STRING,
        allowNull : true,
      },
      phone : {
        type : Sequelize.STRING,
        allowNull : true
      },
      message : {
        type : Sequelize.TEXT,
        allowNull : false
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
    await queryInterface.addColumn('farmer', 'village', {
      type : Sequelize.STRING,
      allowNull : true
    });
    await queryInterface.addColumn('farmer', 'ward', {
      type : Sequelize.STRING,
      allowNull : true
    });
    await queryInterface.addColumn('product', 'local_name', {
      type : Sequelize.STRING,
      allowNull : true
    });
    await queryInterface.addColumn('farmer', 'profile_pic', {
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
