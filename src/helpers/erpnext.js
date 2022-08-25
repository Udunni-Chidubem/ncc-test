const axios = require("axios").default;
const FormData = require("form-data");
module.exports = {
  login: async (username, password) => {
    try {
      let form = new FormData();
      form.append("usr", username);
      form.append("pwd", password);
      console.log(form);
      let resp = await axios.post(
        "https://nigsimserp.interranetworks.com/api/method/library_management.api.login",
        form,
        {
          headers: form.getHeaders(),
        }
      );
      // return "erp end point works";
      // console.log(resp);
      return resp.data;
    } catch (e) {
      console.log(e);
      return e;
    }
  },
};
