'use strict';

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
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

  return User;
};
