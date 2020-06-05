/* You'll need to have MySQL running and your Node server running
 * for these tests to pass. */

var mysql = require('mysql');
var request = require('request'); // You might need to npm install the request module!
var expect = require('chai').expect;

describe('Persistent Node Chat Server', function() {
  var dbConnection;

  beforeEach(function(done) {
    dbConnection = mysql.createConnection({
      user: 'student',
      password: 'student',
      database: 'chat'
    });
    dbConnection.connect();

    var tablename = 'messages';
    var tablename2 = 'users';

    /* Empty the db table before each test so that multiple tests
     * (or repeated runs of the tests) won't screw each other up: */
    dbConnection.query(`DELETE FROM ${tablename}`, (err) => {
      if (err) {return done(err)}
      dbConnection.query(`DELETE FROM ${tablename2}`, (err) => {
        if (err) {return done(err)}
        done();
      });
    });
  });

  afterEach(function() {
    dbConnection.end();
  });

  it('Should insert posted messages to the DB', function(done) {
    // Post the user to the chat server.
    request({
      method: 'POST',
      uri: 'http://127.0.0.1:3000/classes/users',
      json: { username: 'Valjean' }
    }, function () {
      // Post a message to the node chat server:
      request({
        method: 'POST',
        uri: 'http://127.0.0.1:3000/classes/messages',
        json: {
          username: 'Valjean',
          text: 'In mercy\'s name, three days is all I need.',
          roomname: 'Hello'
        }
      }, function (err) {
        if (err) {
          return done(err);
        } else {
          // Now if we look in the database, we should find the
          // posted message there.

          // TODO: You might have to change this test to get all the data from
          // your message table, since this is schema-dependent.
          var queryString = 'SELECT * FROM messages';

          dbConnection.query(queryString, function(err, results) {
            if (err) { return done(err); }
            console.log(results);
            // Should have one result:
            expect(results.length).to.equal(1);

            // TODO: If you don't have a column named text, change this test.
            expect(results[0].text).to.equal('In mercy\'s name, three days is all I need.');

            done();
          });
        }
      });
    });
  });

  it('Should output all messages from the DB', function(done) {
    var queryString = "INSERT INTO users (username) VALUES('JOSH')";
    dbConnection.query(queryString, function(err, results) {
      if (err) { throw err; }
      request('http://127.0.0.1:3000/classes/users', function(error, response, body) {
        var userList = JSON.parse(body);
        expect(userList[0]).to.equal('JOSH');
      });
    });
    // Let's insert a message into the db
    var queryString2 = "INSERT INTO messages(username, text, createdAt, roomname, updatedAt) VALUES('JOSH', 'Men like you can never change!', (SELECT CURDATE()), 'main', (SELECT CURDATE()))";
    var queryArgs = [];

    // INSERT INTO messages(username, text, createdAt, roomname, updatedAt) VALUES('JOSH', 'Men like you can never change!', (SELECT CURDATE()), 'main', (SELECT CURDATE()));

    // INSERT INTO messages(username, text, createdAt, roomname, updatedAt) VALUES('chels', 'some testing stuff', (SELECT CURDATE()), 'test room', (SELECT CURDATE()));



    // TODO - The exact query string and query args to use
    // here depend on the schema you design, so I'll leave
    // them up to you. */

    dbConnection.query(queryString2, queryArgs, function(err) {
      if (err) { throw err; }

      // Now query the Node chat server and see if it returns
      // the message we just inserted:
      request('http://127.0.0.1:3000/classes/messages', function(error, response, body) {
        var messageLog = JSON.parse(body);
        expect(messageLog[0].text).to.equal('Men like you can never change!');
        expect(messageLog[0].roomname).to.equal('main');
        done();
      });
    });
  });
});
