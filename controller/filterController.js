const connection = require('../database/connection');
module.exports.filterCategory = (req, res) => {
  const filter = req.params.filter;
  const sql = 'select * from clothes where cloth_status=?&&category=?';
  if (filter == 'all') {
    const sql = 'select * from clothes where cloth_status=?';
    connection.query(sql, ['not sold'], (err, result) => {
      if (!err) {
        res.render('home', { result: result });
      } else res.redirect('/');
    });
  }

  connection.query(sql, ['not sold', filter], (err, result) => {
    //res.render('home', { result: result });
    if (!err) {
      res.render('home', { result: result });
    } else res.redirect('/');
  });
};
module.exports.filterClothName = (req, res) => {
  const filter = req.params.filter;
  const sql = 'select * from clothes where cloth_status=?&&cloth_name=?';
  connection.query(sql, ['not sold', filter], (err, result) => {
    //res.render('home', { result: result });
    if (!err) {
      res.render('home', { result: result });
    } else res.redirect('/');
  });
};
