// import logger from './logger';

export default {
  "development": {
    "database": "gondolin",
    "username": "gondolin",
    "password": "gondolin",
    "dialect": "postgres",
    "host": "localhost",
    "port": 5555,
    "protocol": "postgres",
    "schema": "gondolin",
    // TODO Does currently not work... Fix it
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
