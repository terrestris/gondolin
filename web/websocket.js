const logger = require('../config/logger');

const WebSocket = require('../service/WebSocket');

const websocketService = new WebSocket();

module.exports = app => {
  /**
   * Handles messages between client and server.
   */
  app.ws('/websocket', ws => {
    ws.on('message', msg => {
      websocketService.getUserFromMessage(msg, ws)
        .then(user => {
          if (user) {
            try {
              websocketService.readMessage(JSON.parse(msg), user, ws)
            } catch (error) {
              logger.error(`Error reading WebSocket message ${msg}: ${error}.`);
            }
          } else {
            const message = 'Couldn\'t get user from request. Make sure to add the jwt to the request.';
            logger.warn(message);
            ws.send(JSON.stringify({
              message: message,
              type: 'error'
            }));
          }
        })
        .catch(error => {
          const message = `Error establishing WebSocket: ${error}.`;
          logger.error(message);
          ws.send(JSON.stringify({
            message: message,
            type: 'error'
          }));
        });
    });
  });
}
