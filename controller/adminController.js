const connection = require('../database/connection');
const bcrypt = require('bcrypt');

module.exports.createAccountGet = (req, res) => {
  res.render('admin/createAccount');
};
module.exports.createAccount = async (req, res) => {
  const { userName, userId, role, password, confirmPassword } = req.body;

  if (password === confirmPassword) {
    if (password.length >= 6) {
      const hashedPassword = await bcrypt.hash(confirmPassword, 8);
      const sql =
        'insert into account (user_id,user_name,role,password) values (?,?,?,?)';
      connection.query(
        sql,
        [userId, userName, role, hashedPassword],
        (err, result) => {
          if (!err) {
            if (role == 'admin') res.redirect('/admin/registerAdmin');
            else if (role == 'seller')
              res.render('admin/registerSeller', { userId: userId });
            else if (role == 'delivery')
              res.render('admin/registerDeliveryMan', { userId: userId });
          } else
            res.render('admin/createAccount', {
              message: 'user id occupied',
            });
        }
      );
    } else {
      res.render('admin/createAccount', {
        message: 'password length must be greater than 6',
      });
    }
  } else
    res.render('admin/createAccount', {
      message: 'password and confirm password must be the same',
    });
};
module.exports.registerSeller = (req, res) => {
  const filename = req.file.filename;
  // console.log(filename);
  const { firstName, lastName, shopNumber, phoneNumber, address, date } =
    req.body;

  const sql = 'select user_id from account where user_id=?&& role=?';
  const sql1 =
    'INSERT INTO sellers (seller_id,first_name,last_name,address, shop_number, phone_number,regstration_date,identity_card) Values (?,?,?,?,?,?,?,?)';
  connection.query(sql, [shopNumber, 'seller'], (err, result) => {
    if (result.length == 0) {
      res.render('admin/registerSeller', {
        message: "User Doesn't exist please create seller account",
      });
    } else {
      if (result[0].user_id) {
        connection.query(
          sql1,
          [
            shopNumber,
            firstName,
            lastName,
            address,
            shopNumber,
            phoneNumber,
            date,
            filename,
          ],
          (err, resl) => {
            if (!err) {
              res.render('admin/registerSeller', {
                message: 'Successfully registered',
              });
            } else {
              res.render('admin/registerSeller', {
                message: 'User id occupied',
              });
            }
          }
        );
      } else res.render('admin/registerSeller', { message: 'User not found!' });
    }
  });
};
module.exports.registerAdminGet = (req, res) => {
  res.redirect('/login');
};

module.exports.registerSellerGet = (req, res) => {
  res.render('admin/registerSeller');
};

module.exports.registerDeliveryManGet = (req, res) => {
  res.render('admin/registerDeliveryMan');
};
module.exports.registerDeliveryMan = (req, res) => {
  const { firstName, lastName, id, address, phoneNumber, date } = req.body;
  const sql = 'select user_id from account where user_id=?&& role=?';
  const sql1 =
    'insert into deliveryman(delivery_id,first_name,last_name,address,phone_number,date) values (?,?,?,?,?,?)';
  connection.query(sql, [id, 'delivery'], (err, result) => {
    if (result.length == 0) {
      res.render('admin/registerDeliveryMan', {
        message: "User Doesn't exist please create delivery account",
      });
    } else {
      if (result[0].user_id) {
        connection.query(
          sql1,
          [id, firstName, lastName, address, phoneNumber, date],
          (err, resl) => {
            if (!err) {
              res.render('admin/registerDeliveryMan', {
                message: 'Successfully registered',
              });
            } else {
              res.render('admin/registerDeliveryMan', {
                message: 'User id occupied',
              });
            }
          }
        );
      } else
        res.render('admin/registerDeliveryMan', { message: 'User not found!' });
    }
  });
};

module.exports.viewSeller = (req, res) => {
  const sql = 'select * from sellers ';
  connection.query(sql, (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.render('admin/viewSeller', { result: result });
    }
  });
};

module.exports.viewDeliveryMan = (req, res) => {
  const sql = 'select * from deliveryman';
  connection.query(sql, (err, result) => {
    if (!err) {
      res.render('admin/viewDeliveryMan', { result: result });
    } else res.send('some thing went wrong');
  });
};
module.exports.generateReportGet = (req, res) => {
  res.render('admin/report');
};
module.exports.generateReportPost = (req, res) => {
  res.send('<h1>report generated</h1>');
};
module.exports.deleteSeller = (req, res) => {
  const id = req.params.id;
  const sql = 'delete from account where user_id=?';
  const sql2 = 'delete from clothes where seller_id=?';
  connection.query(sql, [id], (err) => {
    if (!err) {
      connection.query(sql2, [id], () => {
        res.redirect('/admin/viewSeller');
      });
    }
  });
};
