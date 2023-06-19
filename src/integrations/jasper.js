const axios = require("axios").default;
module.exports = {
  onlineTransactions: async (Location,Product,Status, from, to) => {
    let url = `http://nigsims.com:8080/jasperserver/rest_v2/reports/reports/Online_transaction.html?Location=${Location}&Product=${Product}&Status=${Status}&from=${from}&to=${to}&j_username=jasperadmin&j_password=jasperadmin`;
    let response = await axios.get(url);
    return response;
  },
 
  download: async (url) => {
    let respnse = await axios.get(url, {
      responseType: "document",
      headers: {
        "Content-Type": "application/pdf",
      },
    });
    return respnse;
  },
};
