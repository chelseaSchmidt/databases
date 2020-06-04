var models = require('../models');


module.exports = {
  get: function (req, res) {
    models.messages.getAll((err, data) => {
      if (err) {
        res.status(404);
        res.set({
          "access-control-allow-origin": "*",
          "access-control-allow-methods": "GET, POST, OPTIONS",
          "access-control-allow-headers": "*"
        });
        res.send('error retrieving messages from db');
      } else {
        res.status(200);
        res.set({
          "access-control-allow-origin": "*",
          "access-control-allow-methods": "GET, POST, OPTIONS",
          "access-control-allow-headers": "*"
        });
        console.log('data received by controller: ', data);
        res.json(data);
      }
    });
  },
  // a function which handles a get request for all messages
  post: function (req, res) {} // a function which handles posting a message to the database
};
