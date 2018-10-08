const Generic = require('./Generic.js');
const generic = new Generic();

const CurrentEntityUploads = {};

/**
 * Creates entities. It collects entity data in an array until the DB import
 * is actually triggered by the endentityimport message.
 *
 * @class EntityUploadService
 */
class EntityUploadService {

  /**
   * Creates a new import config.
   * @param  {string} user the user doing the import
   * @param  {string} modelName the entity type to import
   */
  startImport(user, modelName) {
    CurrentEntityUploads[user] = {
      modelName,
      data: []
    }
  }

  /**
   * Adds a slice of entity data.
   * @param {string} user the importing user
   * @param {object[]} data the data to add
   */
  addData(user, data) {
    const config = CurrentEntityUploads[user];
    config.data = config.data.concat(data);
  }

  /**
   * Performs the actual import into the DB.
   * @param  {string} user the user doing the import
   * @param  {Websocket} websocket the user's websocket to notify once the import
   * is done
   */
  doImport(user, websocket) {
    const config = CurrentEntityUploads[user];
    generic.createEntities(config.modelName, config.data, user)
      .then(data => {
        websocket.send(JSON.stringify({
          entityImportDone: true,
          entityImportMessage: data
        }));
        delete CurrentEntityUploads[user];
      })
      .catch(error => {
        websocket.send(JSON.stringify({
          entityImportError: true,
          error
        }));
        delete CurrentEntityUploads[user];
      });
  }

}

module.exports = EntityUploadService;
