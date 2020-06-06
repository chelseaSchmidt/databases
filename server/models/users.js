var db = require('../db');

module.exports = {
  getAll: function (callback) {
    let sql = 'SELECT * FROM users';
    db.mysql.query(sql, (err, results) => {
      if (err) {return callback(err)}
      callback(null, results);
    });
  },
  create: function (username, callback) {
    let sql = `INSERT INTO users (username) VALUES (?)`;
    let queryArgs = [username];
    db.mysql.query(sql, queryArgs, (err, results) => {
      if (err) {
        console.log(err);
        callback(err);
      } else {
        callback(null, 'user created successfully');
      }
    });
  }
};
