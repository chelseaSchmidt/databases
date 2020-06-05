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
    db.mysql.query(`SELECT * FROM users WHERE username='${username}'`, (err, results) => {
      if (err) {
        users.create(username, (err, results) => {
          if (err) {
            callback('error creating user');
          } else {
            db.mysql.query(`INSERT INTO messages(username, text, createdAt, roomname, updatedAt)
                            VALUES(${username}, ${text}, (SELECT CURDATE()), ${roomname},
                            (SELECT CURDATE()))`, (err, results) => {
              if (err) {
                callback('user created but error adding message');
              } else {
                callback(null, 'user and message added to database');
              }
            });
          }
        });
      } else {
        db.mysql.query(`INSERT INTO messages(username, text, createdAt, roomname, updatedAt) VALUES('${username}', '${text}', (SELECT CURDATE()), '${roomname}', (SELECT CURDATE()))`, (err, results) => {
          if (err) {
            callback('error adding message for existing user');
          } else {
            callback(null, 'message added to database');
          }
        });
      }
    });

  }
};
