"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    // await queryInterface.removeColumn('seedProducer', 'name_of_seed')
    // await queryInterface.removeColumn('seedProducer', 'variety_of_seed')
    // await queryInterface.removeColumn('seedProducer', 'volume_of_seed')
    await queryInterface.createTable("noSeedCompanyseedProducerSeeds", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      producer_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "noSeedCompanyseedProducer",
          key: "id",
        },
      },
      name_of_seed: {
        type: Sequelize.STRING,
      },
      variety_of_seed: {
        type: Sequelize.STRING,
      },
      volume_of_seed: {
        type: Sequelize.STRING,
      },
      unit: {
        type: Sequelize.STRING,
      },
      year_produced: {
        type: Sequelize.STRING,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
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
