const multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, callBack) {
    callBack(null, 'image/clothes');
  },
  filename: function (req, file, callBack) {
    const filename = Date.now();
    callBack(null, file.fieldname + file.originalname);
  },
});
module.exports.upload = multer({ storage: storage });
