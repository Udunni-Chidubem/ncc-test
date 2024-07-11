"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("seedProducer", "gender", {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.changeColumn("seedProducerSeeds", "volume_of_seed", {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.changeColumn("seedProducerSeeds", "unit", {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.changeColumn("seedProducer", "age_range", {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};
