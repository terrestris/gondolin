import AuthenticationService,
  {
    jwtMiddleWare
  } from '../service/Authentication';

import {
  Application
} from 'express';

module.exports = (app: Application) => {
  const authenticationService = new AuthenticationService(app);

  /**
   * Webinterface to get the User by its token. The token needs to be in the
   * Authentication as "Bearer [token]".
   */
  app.get('/getUserByToken', jwtMiddleWare, async (req, res) => {
    if (req.user) {
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
      const status = loginResponse.success ? 200 : 401;
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
      const status = registerResponse.success ? 200 : 401;
      res.status(status).json(registerResponse);
    } catch (error) {
      res.status(500).json({success: false, message: error});
    }
  });
};
