const { upload } = require("../helpers/file.helpers");

module.exports = {
  uploadFile: async (req, res) => {
    if (req.query.path && req.files.upload) {
      let fileName = await upload(req.files.upload, req.query.paht);
      res.status(200).json({
        statusCode: 200,
        message: "file uploaded successfully",
        data: { fileName: fileName },
      });
    } else {
      res.status(400).json({
        statusCode: 400,
        message: "Invalid Input",
        data: "the path query parameter is missing",
      });
    }
    return;
  },
};
