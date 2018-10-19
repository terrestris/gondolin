// import logger from './logger';

export default {
  development: {
    database: 'gondolin',
    username: 'gondolin',
    password: 'gondolin',
    dialect: 'postgres',
    host: 'localhost',
    port: 5555,
    protocol: 'postgres',
    schema: 'gondolin',
    databaseVersion: '10.2.5'
    // TODO Does currently not work... Fix it
    // logging: logger.sequelize
  },
  production: {
    database: 'gondolin',
    username: 'gondolin',
    password: 'gondolin',
    dialect: 'postgres',
    host: 'gondolin-postgis',
    port: 5432,
    protocol: 'postgres',
    schema: 'gondolin',
    databaseVersion: '10.2.5',
    logging: false
  }
};
