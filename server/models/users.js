var db = require('../db');

module.exports = {
  getAll: function () {},
  create: function (username, callback) {
    db.mysql.query(`INSERT INTO users (username) VALUES ('${username}')`, (err, results) => {
      if (err) {
        console.log(err);
        callback(err);
      } else {
        callback(null, 'user created successfully');
      }
    });
  }
};
