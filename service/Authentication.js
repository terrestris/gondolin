const logger = require('../config/logger');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const passportJWT = require("passport-jwt");
const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;
const SecurityUtil = require('../util/SecurityUtil');
const {
  models
} = require('../sequelize');
const { secretOrKey } = require('../config/passport');

const jwtOptions = {}
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = secretOrKey;

const jwtStrategy = new JwtStrategy(jwtOptions, (jwt_payload, next) => {
  models.User.findOne({
    where: {
      id: jwt_payload.id
    }
  })
  .then(user => {
    if (user) {
        next(null, user);
      } else {
        next(null, false);
      }
    });
});

/**
 * The AuthenticationService provides functionality to login and logout users.
 *
 * @class AuthenticationService
 */
class AuthenticationService {

  /**
   *Creates an instance of AuthenticationService.
   *
   * @param {ExpressApp} app
   * @memberof AuthenticationService
   */
  constructor(app) {
    passport.use(jwtStrategy);
    app.use(passport.initialize());
  }

  /**
   * Login a user by name and password.
   *
   * @param {string} inputName
   * @param {string} inputPassword
   * @return {object} Returnobject in form {
   *  success: {boolean},
   *  message: {string},
   *  token: {JWT}
   * }
   * @memberof AuthenticationService
   * @async
   */
  async login(inputName, inputPassword) {
    logger.info('User is trying to login.');

    return models.User.scope('withPassword').findOne({
      where: {
        username: inputName
      }
    })
      .then((user) => {
        if(!user){
          logger.info('Login failed. No such user.');
          return {
            success: false,
            message:"No such user."
          };
        }

        const {
          id,
          username,
          password
        } = user;

        if(SecurityUtil.comparePassword(inputPassword, password)) {
          logger.info('User logged in.');

          const payload = {
            id,
            username
          };

          const token = jwt.sign(payload, jwtOptions.secretOrKey);
          return {
            success: true,
            message: "User logged in.",
            token
          };
        } else {
          logger.info('Login failed. wrong password.');
          return {
            success: false,
            message: "Password did not match."
          };
        }
      });
  }

  /**
   * Register a new user from a userdata object.
   *
   * @param {object} userData An object that can contain all properties of User
   * and Manager.
   * @return {object} Returnobject in form {
   *  success: {boolean},
   *  message: {string},
   *  user: {User}
   * }
   * @memberof AuthenticationService
   * @async
   */
  async register(userData) {
    const {
      username,
      password,
      ...managerData
    } = userData;

    logger.debug(`Registering user ${username}.`);

    const hashedPassword = SecurityUtil.generateHash(password);

    return models.User.create({
        username,
        password: hashedPassword,
        Manager: managerData
      }, {
        include: models.Manager
      })
        .then(user => {
          if(user) {
            user.password = undefined;
            return {
              success: true,
              message: "Registration completed.",
              user
            };
          } else {
            logger.warn('Registration failed.');
            return {
              success: false,
              message: "Registration failed."
            };
          }
        })
        .catch(error => {
          logger.error(`Could not register user: ${error}.`);
          throw error;
        });
  }
}

/**
 * Middleware to be used with express interfaces. e.g.
 *   app.get('/mySecuredInterface', jwtMiddleWare, (req, res) => {});
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const jwtMiddleWare = passport.authenticate('jwt', {
  session: false
});

module.exports ={
  jwtMiddleWare,
  AuthenticationService
};
