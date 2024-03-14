'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const statesData = [
      { name: 'Abia' },
      { name: 'Adamawa' },
      { name: 'Akwa Ibom' },
      { name: 'Anambra' },
      { name: 'Bauchi' },
      { name: 'Bayelsa' },
      { name: 'Benue' },
      { name: 'Borno' },
      { name: 'Cross River' },
      { name: 'Delta' },
      { name: 'Ebonyi' },
      { name: 'Edo' },
      { name: 'Ekiti' },
      { name: 'Enugu' },
      { name: 'FCT' },
      { name: 'Gombe' },
      { name: 'Imo' },
      { name: 'Jigawa' },
      { name: 'Kaduna' },
      { name: 'Kano' },
      { name: 'Katsina' },
      { name: 'Kebbi' },
      { name: 'Kogi' },
      { name: 'Kwara' },
      { name: 'Lagos' },
      { name: 'Nasarawa' },
      { name: 'Niger' },
      { name: 'Ogun' },
      { name: 'Ondo' },
      { name: 'Osun' },
      { name: 'Oyo' },
      { name: 'Plateau' },
      { name: 'Rivers' },
      { name: 'Sokoto' },
      { name: 'Taraba' },
      { name: 'Yobe' },
      { name: 'Zamfara' }
    ];

    // Add created_at and updated_at fields to each record
    const timestamp = new Date();
    statesData.forEach(state => {
      state.created_at = timestamp;
      state.updated_at = timestamp;
    });

    return queryInterface.bulkInsert('States', statesData, {});
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('States', null, {});
  }
};
