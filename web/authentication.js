const {
  AuthenticationService,
  jwtMiddleWare
} = require('../service/Authentication');

module.exports = (app) => {
  const authenticationService = new AuthenticationService(app);

  /**
   * Webinterface to get the User by its token. The token needs to be in the
   * Authentication as "Bearer [token]".
   */
  app.get('/getUserByToken', jwtMiddleWare, (req, res) => {
    if (req.user) {
      req.user.password = undefined;
      res.json({success: true, user: req.user});
    } else {
      res.json({success: false, message: `Couldn't get user by token.`});
    }
  });

  /**
   * Webinterface to login a user.
   */
  app.post('/login', async (req, res) => {
    const {
      name,
      password
    } = req.body;

    try {
      const loginResponse = await authenticationService.login(name, password);
      let status = loginResponse.success ? 200 : 401;
      res.status(status).json(loginResponse);
    } catch (error) {
      res.status(500).json({success: false, message: error});
    }
  });

  /**
   * Webinterface to register a new user.
   */
  app.post('/register', async (req, res) => {
    try {
      const registerResponse = await authenticationService.register(req.body);
      let status = registerResponse.success ? 200 : 401;
      res.status(status).json(registerResponse);
    } catch (error) {
      res.status(500).json({success: false, message: error});
    }
  });
}
