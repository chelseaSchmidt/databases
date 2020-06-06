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

    let sql =`SELECT * FROM users WHERE username=?`;
    let queryArgs = [username];
    db.mysql.query(sql, queryArgs, (err, results) => {
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

            let sql2 = `INSERT INTO messages(username, text, createdAt, roomname, updatedAt) VALUES(?, ?, (SELECT CURDATE()), ?, (SELECT CURDATE()))`;
            let queryArgs2 = [username, text, roomname];

            db.mysql.query(sql2, queryArgs2, (err, results) => {
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
        let sql2 = `INSERT INTO messages(username, text, createdAt, roomname, updatedAt) VALUES(?, ?, (SELECT CURDATE()), ?, (SELECT CURDATE()))`;

        let queryArgs2 = [username, text, roomname];

        db.mysql.query(sql2, queryArgs2, (err, results) => {
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
