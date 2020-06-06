var models = require('../models');


module.exports = {
  get: function (req, res) {
    models.messages.getAll((err, data) => {
      if (err) {
        res.status(404);
        res.send('error retrieving messages from database');
      } else {
        res.status(200);
        res.json(data);
      }
    });
  },

  post: function (req, res) {
    models.messages.create(req, (err, data) => {
      if (err) {
        res.status(400);
        res.send(err);
      } else {
        res.status(201);
        res.send(data);
      }
    });
  }
};
