import bCrypt = require('bcrypt-nodejs');

/**
 *
 */
export default class SecurityUtil {
  static generateHash(password: string): string {
    return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
  }

  static comparePassword(plainPassword: string, hash: string): boolean {
    return bCrypt.compareSync(plainPassword, hash);
  }
}
