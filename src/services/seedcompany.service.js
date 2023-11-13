const { QueryTypes, Op } = require("sequelize");
const db = require("../models");
const { Orders } = db;
module.exports = {
  orderCount: async (company_id) => {
    try {
      let sql =
        "SELECT 'unfulfilled' as name, COUNT(*) as count FROM `orders` WHERE status !=4 and status != null and company_id=" +
        company_id +
        " UNION SELECT 'fulfilled' as name, COUNT(*) as count FROM `orders` WHERE status =4 and company_id=" +
        company_id;

      let result = await db.rest.query(sql, {
        types: QueryTypes.SELECT,
        raw: true,
      });
      result = JSON.parse(JSON.stringify(result));
      const transformedData = {};
      result[0].forEach((item) => {
        transformedData[item.name] = item.count;
      });
      return transformedData;
    } catch (e) {
      console.log(e);
    }
  },
  productCount: async (company_id) => {
    try {
      let sql =
        "SELECT status, count(product_name) as count FROM product where user_id=" +
        company_id +
        " group by status";
      let result = await db.rest.query(sql, {
        types: QueryTypes.SELECT,
        raw: true,
      });
      result = JSON.parse(JSON.stringify(result));
      const transformedData = {};
      result[0].forEach((item) => {
        transformedData[item.status == 1 ? "Active" : "inActive"] = item.count;
      });
      return transformedData;
    } catch (e) {
      console.log(e);
    }
  },
};
