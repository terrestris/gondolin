'use strict';

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    clientConfig: {
      type: DataTypes.JSONB
    },
    details: {
      type: DataTypes.JSONB
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
  }, {
    // If requested without scope, the password(hash) of a user will not be included
    // in the result.
    defaultScope: {
      attributes: {
        exclude: ['password']
      }
    },
    // If requested with scope 'withPassword' the password will be included in the
    // result.
    scopes: {
      withPassword: {
        attributes: {}
      }
    }
  });

  User.associate = models => {
    User.belongsToMany(models.UserGroup, {
      through: 'User_UserGroup'
    });
  };

  return User;
};
