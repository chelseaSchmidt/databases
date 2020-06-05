var db = require('../db');

module.exports = {
  getAll: function (callback) {
    db.mysql.query('SELECT * FROM messages', (err, results) => {
      if (err) {
        console.log('mysql error');
        callback(err, null);
      } else {
        console.log('mysql success');
        let data = {};
        data.results = results;
        console.log('data received from mysql getAll: ', data.results);
        callback(null, data);
      }
    });
  }, // a function which produces all the messages
  create: function () {} // a function which can be used to insert a message into the database
};
