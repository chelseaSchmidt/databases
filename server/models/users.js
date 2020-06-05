var db = require('../db');

module.exports = {
  getAll: function () {},
  create: function (username, callback) {
    //Escape single quotes===========================
    let apostrophe = /'/g;

    if (username.indexOf(`'`) > -1) {
      username = username.replace(apostrophe, `''`);
    }
    //===============================================
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
