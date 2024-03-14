'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    // await queryInterface.addColumn('seedProducer', 'gender', {
    //   type: Sequelize.STRING,
    //   allowNull: true,
    
    // });
    // await queryInterface.addColumn('seedProducer', 'age_range', {
    //   type: Sequelize.STRING,
    //   allowNull: true,
    // });
    // await queryInterface.addColumn('seedProducer', 'living_status', {
    //   type: Sequelize.STRING,
    //   allowNull: true,
    // });  
// SEED PRODUCER SEEDS MIGRATION
  //   await queryInterface.addColumn('seedProducerSeeds', 'unit', {
  //     type: Sequelize.STRING,
  //     allowNull: true,
  //   });
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
