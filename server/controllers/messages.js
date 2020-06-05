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
        res.send('error retrieving messages from database');
      } else {
        res.status(200);
        res.set({
          "access-control-allow-origin": "*",
          "access-control-allow-methods": "GET, POST, OPTIONS",
          "access-control-allow-headers": "*"
        });
        res.json(data);
      }
    });
  },

  post: function (req, res) {
    models.messages.create(req, (err, data) => {
      if (err) {
        res.status(400);
        res.set({
          "access-control-allow-origin": "*",
          "access-control-allow-methods": "GET, POST, OPTIONS",
          "access-control-allow-headers": "*"
        });
        res.send(err);
      } else {
        res.status(201);
        res.set({
          "access-control-allow-origin": "*",
          "access-control-allow-methods": "GET, POST, OPTIONS",
          "access-control-allow-headers": "*"
        });
        console.log('data received by controller: ', data);
        res.send(data);
      }
    });
  } // a function which handles posting a message to the database
};
