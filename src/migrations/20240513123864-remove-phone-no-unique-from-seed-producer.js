"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("seedProducer", "phone_no", {
      type: Sequelize.STRING,
      unique: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("seedProducer", "phone_no", {
      type: Sequelize.STRING,
      unique: false,
    });
  },
};
