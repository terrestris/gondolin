'use strict';
import {Sequelize} from 'sequelize-typescript';
import dataBaseConfig from './config/database';
import logger from './config/logger';

const environment = process.env.NODE_ENV || 'production';
const config = dataBaseConfig[environment];
const modelsPath = __dirname + '/models';
const belongsToManyPath = __dirname + '/models/belongsToMany';

logger.debug(`Starting database intialization with environment ${environment}.`);

// Main
const sequelize = new Sequelize({
  modelPaths: [
    modelsPath,
    belongsToManyPath
  ],
  ...config
});

// Sync database schemas
// Main

sequelize.createSchema(config.schema, {})
  .then(() => {
    sequelize.sync();
  })
  .then(() => {
    logger.info(`Database (schema ${config.schema}) synchronized.`);
  })
  .catch((err) => {
    logger.error(`Database (schema ${config.schema}) synchronization failed: ${err}`);
  });

export default sequelize;
