'use strict';

module.exports = (sequelize, DataTypes) => {
  const EntityAccess = sequelize.define('EntityAccess', {
    endPoint: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });

  EntityAccess.associate = models => {
    EntityAccess.belongsToMany(models.Role, {
      through: 'EntityAccess_Role',
      allowNull: false
    });
    EntityAccess.belongsTo(models.EntityOperation, {
      foreignKey: {
        name: 'EntityOpeartionID',
        allowNull: false
      }
    });
  };

  return EntityAccess;
};
