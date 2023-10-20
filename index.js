const express = require('express');
const router = require('./routes/router');
const connection = require('./database/connection');
const session = require('express-session');
const mySqlStore = require('express-mysql-session')(session);
const app = express();
// const fileUpload = require('express-fileupload');
// const multer = require('multer');
// const upload = multer({ dest: 'image/' });
app.listen(5000, () => {
  console.log("connected to the server");
});
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.static('image'));
// grap the request as html form
// app.use(fileUpload());
//app.use(express.urlencoded({ extended: false }));
app.use(express.json());
const sessionStore = new mySqlStore(
  {
    expiration: 60 * 60 * 24,
    createDatabaseTable: true,
    schema: {
      tableName: 'sessiontable',
      columnNames: {
        session_id: 'session_id',
        expires: 'expiry',
        data: 'data',
      },
    },
  },
  connection
);
app.use(
  session({
    secret: 'key for sign cookies',
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      expires: new Date(Date.now() + 30 * 86400 * 1000),
    },
  })
);
app.use(router);
