'use strict';

module.exports = (sequelize, DataTypes) => {
  const EntityOperation = sequelize.define('EntityOperation', {
    operation: {
      type: DataTypes.ENUM('ADMIN', 'CREATE', 'READ', 'UPDATE', 'DELETE'),
      allowNull: false
    }
  });

  return EntityOperation;
};
