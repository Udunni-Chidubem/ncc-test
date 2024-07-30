'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await queryInterface.bulkInsert('role', [
      {
        role_name:"farmer"
      },
      {
        role_name: "seed_trader"
      },
      {
        role_name:"seed_company"
      },
      {
        role_name:"admin"
      },
      {
        role_name:"nasc"
      },
      {
        role_name:"rra"
      },
      {
        role_name:"nigsims"
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('role', [
      {
        role_name:"farmer"
      },
      {
        role_name: "seed_trader"
      },
      {
        role_name:"seed_company"
      },
      {
        role_name:"admin"
      },
      {
        role_name:"nasc"
      },
      {
        role_name:"rra"
      },
      {
        role_name:"nigsims"
      }
    ], {});
  }
};
