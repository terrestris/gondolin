import Generic from './Generic';
import { GondolinWebsocketResponse } from '../typings';
const generic = new Generic();

interface EntityUploadStore {
  [username: string]: {
    modelName: string,
    data: any[]
  };
}

const EntityUploadStore: EntityUploadStore = {};

/**
 * Creates entities. It collects entity data in an array until the DB import
 * is actually triggered by the endentityimport message.
 *
 * @class EntityUploadStoreService
 */
export default class EntityUploadService {

  /**
   * Creates a new import config.
   * @param  {string} username the user doing the import
   * @param  {string} modelName the entity type to import
   */
  startImport(username: string, modelName: string) {
    EntityUploadStore[username] = {
      modelName,
      data: []
    };
  }

  /**
   * Adds a slice of entity data.
   * @param {string} username the importing user
   * @param {object[]} data the data to add
   */
  addData(username: string, data: any[]) {
    const config = EntityUploadStore[username];
    config.data = config.data.concat(data);
  }

  /**
   * Performs the actual import into the DB.
   * @param  {string} username the user doing the import
   * @param  {Websocket} websocket the user's websocket to notify once the import
   * is done
   */
  doImport(username: string, websocket: WebSocket) {
    const config = EntityUploadStore[username];
    generic.createEntities(config.modelName, config.data, username)
      .then(data => {
        const response: GondolinWebsocketResponse = {
          type: 'import',
          success: true,
          data
        };
        websocket.send(JSON.stringify(response));
        delete EntityUploadStore[username];
      })
      .catch(error => {
        const response: GondolinWebsocketResponse = {
          success: false,
          type: 'import',
          error
        };
        websocket.send(JSON.stringify(response));
        delete EntityUploadStore[username];
      });
  }

}
