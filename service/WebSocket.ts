import * as jsonwebtoken from 'jsonwebtoken';
import logger from '../config/logger';
import secretOrKey from '../config/passport';
import Generic from './Generic';
import EntityUploadService from './EntityUpload';
import User from '../models/User';
import { GondolinWebsocketResponse } from '../typings';

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
   * @param {WebSocket} websocket The WebSocket to add.
   * @param {User} user The user to add the WebSocket for.
   */
  addSocket(websocket, user: User) {
    logger.debug(`WebSocket for user ${user.username} stored.`);
    WebSocketService.socketStore[user.username] = websocket;
    // When closed, clean up the entry from the websockets hash.
    websocket.on('close', () => {
      this.deleteSocket(user);
    });
  }

  /**
   * Get a WebSocket from the WebSocketService.socketStore.
   *
   * @param {User} user The user to get the WebSocket for.
   */
  getSocket(user: User) {
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
   * @param {WebSocket} websocket The WebSocket itself.
   * @return {Promise} A Promise resolving with the user or undefined
   * if no jwt could be detected.
   */
  getUserFromMessage(msg:string, websocket: WebSocket): Promise<User> {
    const json = JSON.parse(msg);
    const jwt = json.jwt;
    return new Promise((resolve, reject) => {
      if (jwt) {
        const user: any = jsonwebtoken.verify(jwt, secretOrKey);
        resolve(generic.getEntityById('User', user.id as number));
      } else {
        const message = 'Could not read jwt from websocket message. Make sure to add the jwt to the json data';
        logger.warn(message);
        const response: GondolinWebsocketResponse = {
          success: false,
          message,
          type: 'error'
        };
        websocket.send(JSON.stringify(response));
        reject(message);
      }
    });
  }


  /**
   * Read a websocket message.
   *
   * @param {Object} json The message content as json.
   * @param {User} user The user who the message.
   * @param {WebSocket} websocket The WebSocket.
   */
  readMessage(json: any, user: User, websocket: WebSocket) {
    switch (json.message) {
      // Once logged in, the websockets hash will map usernames to websockets.
      // This message causes the hash to be updated.
      case 'connect':
        try {
          this.addSocket(websocket, user);
          const response: GondolinWebsocketResponse = {
            success: true,
            type: 'info',
            message: `WebSocket established for ${user.username}`,
            noPopup: true
          };
          websocket.send(JSON.stringify(response));
        } catch (error) {
          logger.error(`Can not establish WebSocket: ${error}.`);
        }
        break;
      // starts a new entity import
      case 'startentityimport':
        entityUpload.startImport(user.username, json.modelName);
        break;
      // get a slice of entity data
      case 'importdata':
        entityUpload.addData(user.username, json.data);
        break;
      // push the new entities into the DB
      case 'endentityimport':
        entityUpload.doImport(user.username, websocket);
        break;
    }
  }
}

