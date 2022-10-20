const companyRoute = require("express").Router();
const reader = require("xlsx");

companyRoute.post("/profile", async (req, res) => {});
companyRoute.get("/profile", async (req, res) => {});
companyRoute.post("/offline", async (req, res) => {
  let file = reader.readFile(req.files.upload);
  const sheets = file.SheetNames;
  let msg;

  for (let i = 0; i < sheets.length; i++) {
    const temp = reader.utils.sheet_to_json(file.Sheets[file.SheetNames[i]]);
    console.log(temp);
    j = 10000;
    for (let k = 0; k < temp.length; k = k + 200) {
      run(temp, k, j);
      j = j + 10000;
    }
  }
});

module.exports = companyRoute;
