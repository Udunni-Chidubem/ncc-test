"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    queryInterface.addColumn("salesheets", "date_sold", {
      type: Sequelize.DATE,
      allowNull: true,
      default: new Date(),
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    queryInterface.addColumn("salesheets", "date_sold", {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },
};
