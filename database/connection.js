const mysql = require('mysql');
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'cloth',
});

if (connection.connect()) {
  if (err) {
    console.log("database doesn't connecte");
  } else {
    console.log('database connected successfully');
  }
}
module.exports = connection;
