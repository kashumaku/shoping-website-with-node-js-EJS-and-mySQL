const connection = require('../database/connection');
const bcrypt = require('bcrypt');
module.exports.home = (req, res) => {
  const sql = 'select * from clothes where cloth_status=? ';
  connection.query(sql, ['not sold'], (err, result) => {
    if (err) {
      res.render("home", { error: { error: err, result: [] } });
    } else {
      res.render('home', { result: result });
    }
  });
};

module.exports.signUpGet = (req, res) => {
  res.render('signUp');
};

module.exports.loginGet = (req, res) => {
  res.render('login');
};

module.exports.about = (req, res) => {
  res.render('about');
};
module.exports.contact = (req, res) => {
  res.render('contact');
};
//post request
module.exports.signUpPost = (req, res) => {
  const userName = req.body.userName;
  const userId = req.body.userId;

  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  const sql = 'select user_id from account where user_id=?';
  const sql1 =
    'insert into account (user_id,user_name,role,password) values(?,?,?,?)';
  if (password.length >= 6) {
    if (password == confirmPassword) {
      connection.query(sql, [userId], async (err, result) => {
        if (!err) {
          if (result.length > 0) {
            res.render('signUp', { message: 'user alraady exist' });
          } else {
            const hashedPassword = await bcrypt.hash(confirmPassword, 8);
            connection.query(
              sql1,
              [userId, userName, 'buyer', hashedPassword],
              (err, result) => {
                if (!err) {
                  res.render('signUp', {
                    message: 'Successfully registered',
                  });
                } else
                  res.render('signUp', {
                    message: 'something went wrong while registering',
                  });
              }
            );
          }
        }
      });
    } else
      res.render('signUp', {
        message: 'password and confirm password must be similar',
      });
  } else
    res.render('signUp', {
      message: 'password length must greater or equal to 6',
    });
};
module.exports.loginPost = (req, res) => {
  const userName = req.body.userName;
  const password = req.body.password;
  const sql2 = 'select * from account where user_name=?';
  connection.query(sql2, [userName], async (err, result) => {
    if (err) {
      res.render('login', { message: 'something went wrong try again' });
    } else {
      if (result.length > 0) {
        if (await bcrypt.compare(password, result[0].password)) {
          const role = result[0].role;
          const userId = result[0].user_id;

          if (role == 'admin') {
            req.session.authenticated = role;
            res.render('admin/adminMenu', { userId: userId });
          } else if (role == 'seller') {
            req.session.authenticated = role;
            res.render('seller/sellerMenu', { userId: userId });
          } else if (role == 'delivery') {
            req.session.authenticated = role;
            res.render('deliveryMan/deliveryMenu', { userId: userId });
          }
        } else res.render('login', { message: 'wrong password' });
      } else res.render('login', { message: 'user not found' });
    }
  });
};
module.exports.logout = (req, res) => {
  res.redirect('login');
  req.session.destroy();
};
