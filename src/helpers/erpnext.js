const axios = require("axios").default;
module.exports = {
  login: async (username, password) => {
    let formData = new FormData();
    formData.append("usr", username);
    formData.append("pwd", password);
    let resp = axios.post(
      "http://nigsimserp.interranetworks.com/api/method/library_management.api.login",
      formData,
      {
        headers: {
          "Content-Type":
            "multipart/form-data; boundary=<calculated when request is sent>",
        },
      }
    );
    console.log(resp);
    return resp.data;
  },
};
