var models = require('../models');

module.exports = {
  get: function (req, res) {
    models.users.getAll((err, data) => {
      if (err) {return res.sendStatus(404)}
      res.json(data);
    });
  },
  post: function (req, res) {
    models.users.create(req.body.username, (err, data) => {
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
        res.send(data);
      }
    });
  }
};
