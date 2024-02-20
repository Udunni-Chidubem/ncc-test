const db = require("../models/index");
const reader = require("xlsx");
const { Farmer } = db;
module.exports = {
  farmer: async (req, res) => {
    let farmers = await Farmer.findAll();
    farmers = JSON.parse(JSON.stringify(farmers));
    let workBook = reader.utils.book_new();
    const workSheet = reader.utils.json_to_sheet(farmers);
    reader.utils.book_append_sheet(workBook, workSheet, `farmers`);
    let exportFileName = Date.now() + `farmers.xlsx`;
    reader.writeFile(workBook, exportFileName);
    // res.setHeader(
    //   "Content-Type",
    //   "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    // );
    // res.setHeader(
    //   "Content-Disposition",
    //   "attachment; filename=" + exportFileName
    // );
    // res.sendFile("/".exportFileName);
  },
};
