const connection = require('../database/connection');
module.exports.addClothGet = (req, res) => {
  const userId = req.params.user;
  res.render('seller/addcloth', { back: userId });
};

module.exports.viewCloth = (req, res) => {
  const userId = req.params.user;
  const sql = 'select * from clothes where seller_id=?';
  connection.query(sql, [userId], (err, result) => {
    if (err) {
      res.send('error while fetching the cloth ');
    } else {
      const userId = result[0].seller_id;
      res.render('seller/viewCloth', { result: result, back: userId });
      console.log(userId);
    }
  });
};
module.exports.viewSoldCloth = (req, res) => {
  const userId = req.params.userId;
  const sql = 'select * from clothes where seller_id=?&&cloth_status=?';
  connection.query(sql, [userId, 'sold'], (err, result) => {
    if (result.length > 0) {
      res.render('seller/viewSoldCloth', { result: result, back: userId });
    }
  });
};
module.exports.addClothPost = (req, res) => {
  const image = req.file.filename;
  const { clothName, size, category, shopNumber, price, date, description } =
    req.body;
  // res.render('seller/addCloth', { price: price });
  const sql =
    'insert into clothes (cloth_name, size, category, shop_number, price,description, image,seller_id ) values(?,?,?,?,?,?,?,?)';
  connection.query(
    sql,
    [
      clothName,
      size,
      category,
      shopNumber,
      price,
      description,
      image,
      shopNumber,
    ],
    (err) => {
      if (err) {
        res.send('failed to add cloth');
      } else {
        res.render('seller/addCloth', { back: shopNumber });
      }
    }
  );
};
module.exports.deleteCloth = (req, res) => {
  const clothId = req.params.clothId;
  const sql = 'delete from clothes where cloth_id=?';
  const sql1 = 'select seller_id from clothes where cloth_id=?';

  //fetch seller id to render to the seller menu after deleting the cloth
  connection.query(sql1, [clothId], (err, result) => {
    if (!err) {
      const sellerId = result[0].seller_id;
      console.log(sellerId);
      connection.query(sql, [clothId], (err, result) => {
        if (!err) {
          res.redirect(`/seller/viewCloth/${sellerId}`);
        } else res.send('something went wrong!');
      });
    } else res.send('something went wrong!');
  });
};
module.exports.mannageProfile = (req, res) => {
  const userId = req.params.userId;
  const sql = 'select * from sellers where seller_id=?';
  connection.query(sql, [userId], (err, result) => {
    if (!err) {
      const back = result[0].seller_id;
      res.render('seller/profile', { result: result, back: back });
    } else res.send('semething went wrong');
  });
};

//back navigations
module.exports.back = (req, res) => {
  const back = req.params.back;
  res.render('seller/sellerMenu', { userId: back });
};
