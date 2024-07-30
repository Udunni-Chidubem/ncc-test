"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("NoSeedCompanyseedProducerSeeds", {
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
          model: "NoSeedCompanySeedProducer", // Corrected table name
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
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
    await queryInterface.dropTable("NoSeedCompanyseedProducerSeeds");
  },
};
