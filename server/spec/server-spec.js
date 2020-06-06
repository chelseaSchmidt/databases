/* You'll need to have MySQL running and your Node server running
 * for these tests to pass. */

var mysql = require('mysql');
var request = require('request');
var expect = require('chai').expect;
const axios = require('axios').create({
  baseURL: 'http://127.0.0.1:3000/'
});

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
      if (err) { return done(err); }
      dbConnection.query(`DELETE FROM ${tablename2}`, (err) => {
        if (err) { return done(err); }
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

  it('should create a new user for first-time messages', function(done) {
    axios.post('/classes/messages', {
      username: 'SeveralChelseasLater',
      text: 'A very exciting test message',
      roomname: 'curfew-quarantine-life-huzzah'
    })
      .then(res => {
        const sql = `SELECT username FROM users WHERE username='SeveralChelseasLater'`;
        dbConnection.query(sql, (err, results) => {
          if (err) { return done(err); }
          expect(results.length).to.equal(1);
          expect(results[0].username).to.equal('SeveralChelseasLater');
          done();
        });
      })
      .catch(err => {
        done(err);
      });
  });

  it('should protect against SQL injection attacks', function(done) {
    const sql = `INSERT INTO users (username) VALUES('Mr. Spec')`;
    const sql2 = `INSERT INTO messages(username, text, createdAt, roomname, updatedAt) VALUES('Mr. Spec', 'injection tests', (SELECT CURDATE()), 'newRoom', (SELECT CURDATE()))`;

    const getMessages = `SELECT * FROM messages`;

    const message = `DELETE FROM messages`;

    dbConnection.query(sql, (err, res) => {
      if (err) { return done(err); }
      dbConnection.query(sql2, (err, res) => {
        if (err) { return done(err); }
        axios.post('/classes/messages', {
          username: message,
          text: `hopefully this isn't the only message in the table...`,
          roomname: 'a room'
        })
          .then(res => {
            dbConnection.query(getMessages, (err, res) => {
              if (err) { return done(err); }
              expect(res.length).to.equal(2);
              expect(res[0].text).to.equal('injection tests');
              expect(res[1].text).to.equal(`hopefully this isn't the only message in the table...`);
              done();
            });
          })
          .catch(err => {
            done(err);
          });
      });
    });
  });

  it('should not create a new user if user has posted before', function(done) {
    const sql = `INSERT INTO users (username) VALUES('Mr. Spec')`;
    const getUsers = 'SELECT * FROM users';
    dbConnection.query(sql, (err, res) => {
      if (err) { return done(err); }
      axios.post('/classes/messages', {
        username: 'Mr. Spec',
        text: 'second message',
        roomname: 'a room'
      })
        .then(() => {
          dbConnection.query(getUsers, (err, res) =>{
            expect(res.length).to.equal(1);
            expect(res[0].username).to.equal('Mr. Spec');
            done();
          });
        })
        .catch(err => {
          done(err);
        });
    });
  });

  it('should not output any messages after deletion', function(done) {
    dbConnection.query('SELECT * FROM messages', (err, res) => {
      expect(res.length).to.equal(0);
      done();
    });
  });

});
