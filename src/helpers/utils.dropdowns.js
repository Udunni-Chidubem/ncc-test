const db = require("../models");
const { States, LGAs } = db;

module.exports = {
  fetchStates: async () => {
    const states = await States.findAll({
      attributes: ["id", "name"],
    });
    return { success: true, data: states, statusCode: 200 };
  },
  getLgaById: async (id) => {
    const lga = await LGAs.findOne({
      attributes: ["id", "name"],
      where: {
        id: id,
      },
    });
    return { success: true, data: lga, statusCode: 200 };
  },

  getAllCompany: async () => {
    const companies = await db.SeedCompany.findAll({
      attributes: ["id", "name_of_company"],
    });
    return { success: true, data: companies, statusCode: 200 };
  },
};
