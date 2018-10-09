'use strict';
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const dataBaseConfig = require('./config/database.js');
const environment = process.env.NODE_ENV || 'production';
const config = dataBaseConfig[environment];
const modelsPath = __dirname + '/models';
const logger = require('./config/logger');

logger.debug(`Starting database intialization with environment ${environment}.`);

// Main
const sequelizeMain = new Sequelize(config);
const models = {};

// Read models
fs.readdirSync(modelsPath)
  .filter(file => file.endsWith('.js'))
  .forEach(file => {
    const model = sequelizeMain.import(path.join(modelsPath, file));
    models[model.name] = model;
  });

// Create associations
// Main
Object.keys(models).forEach(modelName => {
  const model = models[modelName];
  // Check if custom associate function is present and call it if so.
  if (model.associate instanceof Function) {
    model.associate(models);
  }
});

// Sync database schemas
// Main
sequelizeMain.sync()
  .then(() => {
    logger.info(`Database (schema ${config.schema}) synchronized.`);
  })
  .catch((err) => {
    logger.error(`Database (schema ${config.schema}) synchronization failed: ${err}`);
  });

module.exports = {
  models,
  sequelizeMain,
};
