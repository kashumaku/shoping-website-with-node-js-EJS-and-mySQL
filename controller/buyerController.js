const connection = require('../database/connection');
module.exports.addToCart = (req, res) => {
  const clothId = req.params.id;

  const sql = 'select * from clothes where cloth_id=?';
  connection.query(sql, [clothId], (err, result) => {
    const clothId = result[0].cloth_id;
    const image = result[0].image;
    const price = result[0].price;
    const size = result[0].size;
    const shopNumber = result[0].shop_number;
    const clothName = result[0].cloth_name;
    const description = result[0].description;
    res.render('cart/addToCart', {
      image: image,
      price: price,
      size: size,
      shopNumber: shopNumber,
      clothName: clothName,
      description: description,
      clothId: clothId,
    });
  });
};
module.exports.add = (req, res) => {
  const {
    clothId,
    clothName,
    image,
    buyerId,
    price,
    size,
    shopNumber,
    amount,
    buyerName,
    region,
    zone,
    town,
    phoneNumber,
  } = req.body;
  const sql = "update clothes set cloth_status='sold' where cloth_id=?";
  const sql1 =
    'insert into soldclothes (cloth_id,cloth_name,image,price,size,amount,shop_number,buyer_name,region,zone,town,phone_number,cloth_status,buyer_id) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?) ';
  const sql2 = 'select user_id from account where user_id=?&&role=?';
  connection.query(sql2, [buyerId, 'buyer'], (err, result) => {
    if (!err) {
      if (result.length > 0) {
        connection.query(
          sql1,
          [
            clothId,
            clothName,
            image,
            price,
            size,
            amount,
            shopNumber,
            buyerName,
            region,
            zone,
            town,
            phoneNumber,
            'not delivered',
            buyerId,
          ],
          (err, result) => {
            if (!err) {
              connection.query(sql, [clothId], (err, result) => {
                if (!err) {
                  res.redirect('/');
                } else
                  res.send('some thing went wrong while updating clothes!');
              });
            } else res.send('something went wrong while inserting buyer cloth');
          }
        );
      } else {
        res.render('signUp', { message: 'please create account' });
      }
    } else res.send('semething went wrong while checking buyer account');
  });
};
