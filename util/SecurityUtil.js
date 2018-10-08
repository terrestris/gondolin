const bCrypt = require('bcrypt-nodejs');

/**
 *
 */
class SecurityUtil {
  static generateHash (password) {
    return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
  }

  static comparePassword (plainPassword, hash) {
    return bCrypt.compareSync(plainPassword, hash);
  }
}

module.exports = SecurityUtil;
