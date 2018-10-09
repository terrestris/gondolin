'use strict';

module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define('Role', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
  });

  Role.associate = models => {
    Role.belongsTo(models.UserGroup, {
      foreignKey: {
        name: 'GroupID',
        allowNull: false
      }
    });
    Role.belongsToMany(models.User, {
      through: 'Role_User'
    });
  };

  return Role;
};
