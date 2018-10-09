'use strict';

module.exports = (sequelize, DataTypes) => {
  const Application = sequelize.define('Application', {
    clientConfig: {
      type: DataTypes.JSONB
    },
    layerTree:{
      type: DataTypes.JSONB
    },
    layerConfig: {
      type: DataTypes.JSONB
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    toolConfig: {
      type: DataTypes.JSONB
    },
    stateOnly: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  });

  return Application;
};
