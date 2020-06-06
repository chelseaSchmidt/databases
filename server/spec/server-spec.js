/* You'll need to have MySQL running and your Node server running
 * for these tests to pass. */

var mysql = require('mysql');
var request = require('request');
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
          var queryString = 'SELECT * FROM messages';

          dbConnection.query(queryString, function(err, results) {
            if (err) { return done(err); }
            expect(results.length).to.equal(1);

            expect(results[0].text).to.equal('In mercy\'s name, three days is all I need.');

            done();
          });
        }
      });
    });
  });

  it('Should output all messages from the DB', function(done) {
    var queryString = "INSERT INTO users (username) VALUES('Mr. Spec')";
    dbConnection.query(queryString, function(err, results) {
      if (err) { throw err; }
      request('http://127.0.0.1:3000/classes/users', function(error, response, body) {
        console.log(body);
        var userList = JSON.parse(body);


        var queryString2 = "INSERT INTO messages(username, text, createdAt, roomname, updatedAt) VALUES('Mr. Spec', 'Men like you can never change!', (SELECT CURDATE()), 'main', (SELECT CURDATE()))";
        var queryArgs = [];

        dbConnection.query(queryString2, queryArgs, function(err) {
          if (err) { throw err; }

          request('http://127.0.0.1:3000/classes/messages', function(error, response, body) {
            var messageLog = JSON.parse(body).results;

            expect(userList[0].username).to.equal('Mr. Spec');
            expect(messageLog[0].text).to.equal('Men like you can never change!');
            expect(messageLog[0].roomname).to.equal('main');
            done();
          });
        });
      });
    });
  });

  // it('should create a new user for first-time messages', function(done) {
  //   request.post()
  // });

  // it('should protect against SQL injection attacks', function(done) {

  // });

});
