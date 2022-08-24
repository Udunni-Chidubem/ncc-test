const axios = require("axios").default;
const FormData = require("form-data");
module.exports = {
  login: async (username, password) => {
    let form = new FormData();
    form.append("usr", username);
    form.append("pwd", password);
    let resp = await axios.post(
      "http://nigsimserp.interranetworks.com/api/method/library_management.api.login",
      form,
      {
        headers: form.getHeaders(),
      }
    );
    // console.log(resp);
    return resp.data;
  },
};
