const connection = require('../database/connection');

module.exports.deliveryCloth = (req, res) => {
  const userId = req.params.userId;
  const sql = 'select * from soldclothes';
  connection.query(sql, (err, result) => {
    if (!err) {
      res.render('deliveryMan/deliveryCloth', { result: result, back: userId });
    }
  });
};
