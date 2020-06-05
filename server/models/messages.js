var db = require('../db');
const users = require('./users.js');

module.exports = {
  getAll: function (callback) {
    db.mysql.query('SELECT * FROM messages', (err, results) => {
      if (err) {
        callback(err, null);
      } else {
        let data = {};
        data.results = results;
        callback(null, data);
      }
    });
  },

  create: function (req, callback) {

    let username = req.body.username;
    let text = req.body.text;
    let roomname = req.body.roomname;
    let apostrophe = /\'/g;
    for (let i = 0; i < text.length; i++) {
      if (text.indexOf(`'`) > -1) {
        text = text.replace(apostrophe, `''`);
      }
    }
    console.log(text);

    db.mysql.query(`SELECT * FROM users WHERE username='${username}'`, (err, results) => {
      //If error
      if (err) {
        console.log(err, 1);
        callback('error accessing database to create message');

      //If user does not exist yet
      } else if (results.length === 0) {
        users.create(username, (err, results) => {
          if (err) {
            console.log(err, 2);
            callback('error creating user');

          } else {
            db.mysql.query(`INSERT INTO messages(username, text, createdAt, roomname, updatedAt) VALUES('${username}', '${text}', (SELECT CURDATE()), '${roomname}', (SELECT CURDATE()))`, (err, results) => {
              if (err) {
                console.log(err, 3);
                callback('user created but error adding message');
              } else {
                callback(null, 'user and message added to database');
              }
            });
          }
        });

      //If user already exists
      } else {
        db.mysql.query(`INSERT INTO messages(username, text, createdAt, roomname, updatedAt) VALUES('${username}', '${text}', (SELECT CURDATE()), '${roomname}', (SELECT CURDATE()))`, (err, results) => {
          if (err) {
            console.log(err, 4);
            callback('error adding message for existing user');
          } else {
            callback(null, 'message added to database');
          }
        });
      }
    });

  }
};
