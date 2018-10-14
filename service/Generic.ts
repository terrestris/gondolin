// TODO switch to lodash es6 modules
import * as _ from 'lodash';
import logger from '../config/logger';
import sequelize from '../sequelize';
import User from '../models/User';
import Role from '../models/Role';
import Layer from '../models/Layer';
import UserGroup from '../models/UserGroup';
import Application from '../models/Application';
import { QueryOptions } from 'sequelize-typescript';
const associationMapping = require('../config/pKeyAssociations.json');

import {
  Model
} from 'sequelize';

const models: any = {
  Application,
  User,
  UserGroup,
  Layer,
  Role
};

export default class Generic {

  /**
   * Get a description of the attributes and associations of a given model.
   *
   * @param {string} modelName  The model to get the description for.
   * @return {Object} Object containing attributes and assocations of the model.
   */
  getModelDescription(modelName: string) {
    logger.debug(`Getting model description for ${modelName}.`);
    if (modelName) {

      const attributes = _.cloneDeep(models[modelName].attributes);
      const associations = _.cloneDeep(models[modelName].associations);

      Object.keys(attributes).forEach(attributeName => {
        const attribute = attributes[attributeName];
        attribute.dataType = attribute.type.key;
      });

      // Remove circular references
      Object.keys(associations).forEach(associationName => {
        const association = associations[associationName];
        delete association.options.sequelize;
        delete association.sequelize;
        delete association.source;
        delete association.target;
        delete association.manyFromSource;
        delete association.manyFromTarget;
        delete association.oneFromSource;
        delete association.oneFromTarget;
        delete association.paired;
        delete association.through;
        delete association.throughModel;
        delete association.toSource;
        delete association.toTarget;
      });

      return {attributes, associations};
    } else {
      logger.error(`Could not get model description for ${modelName}.`);
      throw new Error(`Could not get model description for ${modelName}.`);
    }
  }

  /**
   * Get a description of the Geometry column of a specific model.
   * e.g. SRID, TYPE
   *
   * @param {String} modelName The model to get the geometry column description
   * for.
   * @return {Object} Object containing the attributes of the geometry column.
   *
   */
  async getGeometryDescription(modelName: string) {
    logger.debug(`Getting geometry description for ${modelName}.`);
    if (modelName) {
      return sequelize
        .query('SELECT * ' +
          'FROM geometry_columns ' +
          'WHERE f_geometry_column = \'geom\' ' +
          'AND f_table_name = :table_name', {
          type: sequelize.QueryTypes.SELECT,
          replacements: {
            table_name: modelName + 's'
          }
        })
        .catch(error => {
          logger.error(`Could not get geometry description for ${error}.`);
          throw error;
        });
    }
  }

  /**
   * Creates an object to map a given id of an entity to a specific column.
   *
   * These id maps are (among others) used for the CSV import so you can e.g.
   * identify a Plot by its name and not by its (mostly unkonwn and dynamic)
   * database id.
   *
   * The associated column is defined by "associationMapping" from a config file.
   *
   * @param {String} modelName The model to create the id map for.
   * @param {Object} opt Options to be passed to the findAll method of sequelize.
   * @return {Object} The idMap mapping database id (key) with the
   *  associationColumn.
   */
  getIdMap(modelName, opt) {
    logger.debug(`Creating a id map for ${modelName}`);
    const associationColumn = associationMapping[modelName];
    const options = {
      attributes: ['id', associationColumn],
      opt
    };
    return models[modelName]
      .findAll(options || {})
      .then((entities) => {
        const idMap = {};
        entities.forEach((entity) => {
          idMap[entity.id] = entity[associationColumn];
        });
        return idMap;
      })
      .catch(error => {
        logger.error(`Could not get idMap of ${modelName}: ${error}`);
        throw error;
      });
  }

  /**
   * Find an entity by its database id.
   *
   * @param {String} modelName The model to find the entity of.
   * @param {Number} id The id to find the entity of.
   * @param {QueryOptions} opt Options to be passed to the findById method of sequelize.
   * @return {Promise} Promise resolving with the found entity of the given modelName.
   */
  async getEntityById(modelName: string, id: number, opt?: QueryOptions) {
    logger.debug(`Getting ${modelName} with id ${id}.`);
    const model: Model<any, any> = models[modelName];
    return model
      .findById(id, opt || {})
      .catch(error => {
        logger.error(`Could not get ${modelName} with id ${id}: ${error}`);
        throw error;
      });
  }

  /**
   * Find all entities of a given model.
   *
   * @param {String} modelName The model to find the entities of.
   * @param {Object} opt Options to be passed to the findAll method of sequelize.
   * @return {Promise} Promise resolving with all entities of the given modelName.
   */
  async getAllEntities(modelName: string, opt?: QueryOptions) {
    logger.debug(`Getting all entities of ${modelName}.`);
    const model: Model<any, any> = models[modelName];
    return model
      .findAll(opt || {})
      .catch(error => {
        logger.error(`Could not get all entities of ${modelName}: ${error}`);
        throw error;
      });
  }

  /*modelName
   *modelName model.
   *modelName
   * @param {String} modelName The name of the model of the entity that should
   *  be created.
   * @param {Object[]} data An object that should be created.
   * @return {Promise} Promise resolving with an objects containing the created
   * entity data.
   */
  async createEntity(modelName: string, data) {
    logger.debug(`Creating ${modelName}.`);
    return models[modelName]
      .create(data)
      .catch(error => {
        logger.error(`Could not create entities of ${modelName}: ${error}`);
        throw error;
      });
  }

  /**
   * Creates multiple entities of a given model.
   *
   * @param {String} modelName The name of the model of the entities that should
   *  be created.
   * @param {Object[]} data An Array of entity objects that should be created.
   * @param {User} user An user.
   * @return {Promise} Promise resolving with an array of objects of the created
   * entities.
   */
  async createEntities(modelName: string, data, user) {
    logger.debug(`Creating ${data.length} ${modelName}s.`);

    const associations = models[modelName].associations;
    const belongsToManyAssociations = {};
    Object.keys(associations).forEach((associationKey) => {
      const association = associations[associationKey];
      if (association.associationType === 'BelongsToMany') {
        belongsToManyAssociations[associationKey] = association;
      }
    });

    // The model contains belongsToManyAssociations. Bulk creation is not
    // supported for these models so we have to create them one by one.
    if (Object.keys(belongsToManyAssociations).length > 0) {
      return sequelize.transaction((t) => {
        const promises = data.map(tupel => {
          return models[modelName]
            .create(tupel, {
              transaction: t
            })
            .then(instance => {
              // Set belongsToMany Associations
              const updatePromises = Object.keys(belongsToManyAssociations)
                .map((associationKey) => {
                  const association = associations[associationKey];
                  const key = association.as;
                  const value = tupel[key];
                  const associationSetter = association.accessors.set;
                  if (value) {
                    return instance[associationSetter](value, {
                      transaction: t
                    });
                  }
                });
              return sequelize.Promise.all(updatePromises);
            })
            .catch(error => {
              logger.error(`Could not create entities of ${modelName}: ${error}`);
              throw error;
            });
        });

        return sequelize.Promise.all(promises);
      });
    } else {
      // Bulk create instances
      logger.debug('… with bulkCreate');
      return models[modelName]
        .bulkCreate(data)
        .catch(error => {
          logger.error(`Could not bulk create entities of ${modelName}: ${error}`);
          throw error;
        });
    }
  }

  /**
   * Updates multiple entities of a given model.
   *
   * @param {String} modelName The name of the model of the entities that should
   *  be updated.
   * @param {Object[]} data An Array of entity objects that should be updated.
   * @return {Promise} Promise resolving with an array of objects of the updated
   * entities.
   */
  async updateEntities(modelName: string, data) {
    logger.debug(`Updating ${data.length} ${modelName}s.`);

    const associations = models[modelName].associations;
    const belongsToManyAssociations = {};
    Object.keys(associations).forEach(associationKey => {
      const association = associations[associationKey];
      if (association.associationType === 'BelongsToMany') {
        belongsToManyAssociations[associationKey] = association;
      }
    });

    const promises = data.map(newdata => {
      const id = newdata.id;
      delete newdata.id;
      return models[modelName]
        .findById(id)
        .then(row => {
          // Update belongsToMany Associations
          Object.keys(belongsToManyAssociations).forEach((associationKey) => {
            const association = associations[associationKey];
            const key = association.as;
            const value = newdata[key];
            const associationSetter = association.accessors.set;
            if (value) {
              row[associationSetter](value);

            }
          });
          return row.update(newdata);
        })
        .catch(error => {
          logger.error(`Could not update entities of ${modelName}: ${error}`);
        });
    });

    return sequelize.Promise.all(promises);
  }

  /**
   * Deletes entities of modelName by givven ids
   *
   * @param {String} modelName The name of the model of the entities that should
   *  be deleted.
   * @param {ID[]} ids An array of ids of entities that should be deleted.
   * @return {Promise} A Promise resolving with the number of affected rows.
   */
  async deleteEntities(modelName: string, ids) {
    logger.debug(`Deleting ${modelName}s with ids ${ids}.`);
    return models[modelName]
      .destroy({
        where: {
          id: ids
        }
      })
      .catch(error => {
        logger.error(`Could not delete ${modelName} with ids ${ids}: ${error}`);
      });
  }

  /**
   * Count all Entities of a specific model.
   *
   * @param {String} modelName
   * @param {Object} options
   */
  async countEntities(modelName: string, opt?: QueryOptions) {
    logger.debug(`Counting entities of ${modelName}.`);
    return models[modelName]
      .count(opt || {})
      .catch(error => {
        logger.error(`Could not count entities of ${modelName}: ${error}`);
      });
  }
}
