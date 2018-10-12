import logger from '../config/logger';
import WebSocket from '../service/WebSocket';
import User from '../models/User';
import { GondolinWebsocketResponse } from '../typings';

const websocketService = new WebSocket();

module.exports = app => {
  /**
   * Handles messages between client and server.
   */
  app.ws('/websocket', ws => {
    ws.on('message', msg => {
      websocketService.getUserFromMessage(msg, ws)
        .then((user: User) => {
          if (user) {
            try {
              websocketService.readMessage(JSON.parse(msg), user, ws);
            } catch (error) {
              logger.error(`Error reading WebSocket message ${msg}: ${error}.`);
            }
          } else {
            const error = 'Couldn\'t get user from request. Make sure to add the jwt to the request.';
            logger.warn(error);
            const response: GondolinWebsocketResponse = {
              success: true,
              error,
              type: 'error'
            };
            ws.send(JSON.stringify(response));
          }
        })
        .catch(error => {
          const message: string = `Error establishing WebSocket: ${error}.`;
          logger.error(message);
          const response: GondolinWebsocketResponse = {
            success: false,
            message,
            type: 'error'
          };
          ws.send(JSON.stringify(response));
        });
    });
  });
};
