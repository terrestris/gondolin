'use strict';

module.exports = (sequelize, DataTypes) => {
  const Layer = sequelize.define('Layer', {
    clientConfig: {
      type: DataTypes.JSONB
    },
    features:{
      type: DataTypes.JSONB
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    sourceConfig: {
      type: DataTypes.JSONB,
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM('TileWMS', 'VectorTile', 'WFS', 'WMS', 'WMTS', 'XYZ'),
      allowNull: false
    }
  });

  return Layer;
};
