"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

    await queryInterface.addColumn("seedProducerSeeds", "amount_of_seed", {
      type: Sequelize.INTEGER,
      allowNull: true,
    });

    await queryInterface.addColumn(
      "seedProducerSeeds",
      "amount_of_seed_remitted",
      {
        type: Sequelize.INTEGER,
        allowNull: true,
      }
    );

    await queryInterface.addColumn(
      "seedProducerSeeds",
      "amount_of_seed_to_be_remitted",
      {
        type: Sequelize.INTEGER,
        allowNull: true,
      }
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */

    await queryInterface.removeColumn("seedProducerSeeds", "amount_of_seed");
    await queryInterface.removeColumn(
      "seedProducerSeeds",
      "amount_of_seed_remitted"
    );
    await queryInterface.removeColumn(
      "seedProducerSeeds",
      "amount_of_seed_to_be_remitted"
    );
  },
};
