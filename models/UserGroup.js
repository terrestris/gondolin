'use strict';

module.exports = (sequelize, DataTypes) => {
  const UserGroup = sequelize.define('UserGroup', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
  });

  UserGroup.associate = models => {
    UserGroup.belongsToMany(models.User, {
      through: 'User_UserGroup'
    });
  };

  return UserGroup;
};
