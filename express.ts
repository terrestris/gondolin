import express = require('express');
import path = require('path');
import bodyParser = require('body-parser');

import logger from './config/logger';

const app: express.Application = express();
require('express-ws')(app);
const allowCrossDomain = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  return next();
};

app.use(bodyParser.json({limit: '50mb'}));
app.use(allowCrossDomain);

// *****************************
// WEB INTERFACES
// *****************************
require('./web/api')(app);

// *****************************
// Authentication INTERFACES
// *****************************
require('./web/authentication')(app);

// *****************************
// Websocket interfaces
// *****************************
require('./web/websocket')(app);

// serve locale files manually as express.static seems not to like preflight
// requests
app.get('/public/locale/:lang', (req, res) => {
  res.sendFile(path.join(__dirname, `public/locale/${req.params.lang}`));
});

app.listen(3000, () => {
  logger.info('Express-server started under port 3000');
});

module.exports = app;
