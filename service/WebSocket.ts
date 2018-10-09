import jsonwebtoken = require('jsonwebtoken');

import logger from '../config/logger';
import { secretOrKey } from '../config/passport';
import Generic from './Generic';
import EntityUploadService from './EntityUpload';

const generic = new Generic();
const entityUpload = new EntityUploadService();

/**
 * The WebSocketService handles websocket operations such as managing connections
 * and reading message.
 *
 * @class WebSocketService
 */
export default class WebSocketService {

  static socketStore: any = {};

  /**
   * Adds a socket to the WebSocketService.socketStore.
   *
   * @param {WebSocket} socket The WebSocket to add.
   * @param {User} user The user to add the WebSocket for.
   */
  addSocket(socket, user) {
    logger.debug(`WebSocket for user ${user.username} stored.`);
    WebSocketService.socketStore[user.username] = socket;
    // When closed, clean up the entry from the websockets hash.
    socket.on('close', () => {
      this.deleteSocket(user);
    });
  }

  /**
   * Get a WebSocket from the WebSocketService.socketStore.
   *
   * @param {User} user The user to get the WebSocket for.
   */
  getSocket(user) {
    return WebSocketService.socketStore[user.username];
  }

  /**
   * Deletes a Socket from the WebSocketService.socketStore.
   *
   * @param {User} user The user which WebSocket should be delted.
   */
  deleteSocket(user) {
    try {
      delete WebSocketService.socketStore[user.username];
      logger.debug(`WebSocket for user ${user.username} removed.`);
    } catch (error) {
     throw error;
    }
  }

  /**
   * Get the user from the WebSocket message. WebSocket messages send to the
   * backend have to contain the jason web token as key 'jwt'.
   *
   * @param {String} msg The WebSocket message.
   * @param {WebSocket} ws The WebSocket itself.
   * @return {Promise} A Promise resolving with the user or undefined
   * if no jwt could be detected.
   */
  getUserFromMessage(msg, ws) {
    const json = JSON.parse(msg);
    const jwt = json.jwt;
    return new Promise((resolve, reject) => {
      if (jwt) {
        const user = jsonwebtoken.verify(jwt, secretOrKey);
        resolve(generic.getEntityById('User', user.id));
      } else {
        const message = 'Could not read jwt from websocket message. Make sure to add the jwt to the json data';
        logger.warn(message);
        ws.send(JSON.stringify({
          message: message,
          type: 'error'
        }));
        reject(message);
      }
    });
  }


  /**
   * Read a websocket message.
   *
   * @param {Object} json The message content as json.
   * @param {User} user The user who the message.
   * @param {WebSocket} ws The WebSocket.
   */
  readMessage(json, user, ws) {
    switch (json.message) {
      // Once logged in, the websockets hash will map usernames to websockets.
      // This message causes the hash to be updated.
      case 'connect':
        try {
          this.addSocket(ws, user);
          ws.send(JSON.stringify({
            message: `WebSocket established for ${user.username}`,
            noPopup: true
          }));
        } catch (error) {
          logger.error(`Can not establish WebSocket: ${error}.`)
        }
        break;
      // starts a new entity import
      case 'startentityimport':
        entityUpload.startImport(user, json.modelName);
        break;
      // get a slice of entity data
      case 'importdata':
        entityUpload.addData(user, json.data);
        break;
      // push the new entities into the DB
      case 'endentityimport':
        entityUpload.doImport(user, ws);
        break;
    }
  }
}

