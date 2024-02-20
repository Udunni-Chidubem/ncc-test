module.exports = {
  upload: async (upload, path) => {
    filename = Date.now() + upload.name;
    upload.mv(`./public/${path}/` + filename);
    return 
  },
};
