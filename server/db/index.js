var mysql = require('mysql');

var ourSQL = mysql.createConnection({
  user: 'root',
  database: 'chat'
});
ourSQL.connect();

exports.mysql = ourSQL;