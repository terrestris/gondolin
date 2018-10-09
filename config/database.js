// const logger = require('./logger');

const config = {
  "development": {
    "database": "gondolin",
    "username": "gondolin",
    "password": "gondolin",
    "dialect": "postgres",
    "host": "localhost",
    "port": 5555,
    "protocol": "postgres",
    "schema": "gondolin",
    // TODO Readd the logger config for the database
    // "logging": logger.sequelize
  },
  "production": {
    "database": "gondolin",
    "username": "gondolin",
    "password": "gondolin",
    "dialect": "postgres",
    "host": "gondolin-postgis",
    "port": 5432,
    "protocol": "postgres",
    "schema": "gondolin",
    "logging": false
  }
};

module.exports = config;
