const reader = require("xlsx");
const siteController = require("../controllers/site.controller");
const db = require("../models/index");
// const { parentPort }=require('worker_threads')
const { User } = db;
module.exports = {
  farmer: () => {
    let file = reader.readFile("public/files/farmers.xlsx");
    //  let data = []
    const sheets = file.SheetNames;
    let msg;

    for (let i = 0; i < sheets.length; i++) {
      const temp = reader.utils.sheet_to_json(file.Sheets[file.SheetNames[i]]);

      j = 10000;
      for (let k = 0; k < temp.length; k = k + 200) {
        run(temp, k, j);
        j = j + 10000;
      }
    }
  },
};
async function run(data, itr, timeout) {
  setTimeout(async function () {
    for (j = itr; j <= itr + 200; j++) {
      let res = data[j];
      if (res != undefined && res != null && res != "") {
        let count = await User.count({
          where: { username: res.phone },
        });
        console.log(j, count);
        if (count < 1) {
          let names = res.name.split(" ");
          let rq = {};
          let rs = {};
          rq.body = {};
          rq.body.firstname = names[0];
          rq.body.lastname = names[1];
          rq.body.phone_number = res.phone;
          rq.body.password = res.password;
          await siteController.savefarmer(rq, rs);
        }
      }
    }
  }, timeout);
}
//parentPort.postMessage("hello")
