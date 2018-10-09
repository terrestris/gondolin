'use strict';

module.exports = (sequelize, DataTypes) => {
  const ServiceAccess = sequelize.define('ServiceAccess', {
    access: {
      type: DataTypes.ENUM('ALLOW', 'DENY', 'MODIFY'),
      allowNull: false
    },
    endPoint: {
      type: DataTypes.STRING,
      allowNull: false
    },
    event: {
      type: DataTypes.ENUM('REQUEST', 'RESPONSE'),
      allowNull: false
    },
    operation: {
      type: DataTypes.STRING
    },
    service: {
      type: DataTypes.ENUM('WMS', 'WFS', 'WCS'),
      allowNull: false
    }
  });

  ServiceAccess.associate = models => {
    ServiceAccess.belongsToMany(models.Role, {
      through: 'ServiceAccess_Role'
    });
  };

  return ServiceAccess;
};
