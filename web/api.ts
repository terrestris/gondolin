import Generic from '../service/Generic';

import { GondolinResponse } from '../typings/index';
import {
  Request,
  Response,
  Application
} from 'express';

import {
  FindOptions
} from 'sequelize-typescript';

import { jwtMiddleWare } from '../service/Authentication';
import db from '../sequelize';
const {
  models
} = db;

const generic = new Generic();

type QueryParams = {
  include: string
};

const optionsFromQueryParams = (queryParams: QueryParams): FindOptions<any>  => {
  const options: FindOptions<any> = {};
  const {
    include
  } = queryParams;
  if (include) {
    if (include === "all") {
      options.include = [{ all: true }];
    } else {
      const includeModels = include.split(',');
      options.include = includeModels.map((modelName: string) => {
        const model = models[modelName];
        return {model};
      });
    }
  }
  return options;
};

module.exports = (app: Application) => {

  app.get('/', (req: Request, res: Response) => {
    res.send('gondolin-API running.');
  });

  app.get('/:model/describe', (req: Request, res: Response) => {
    const modelName: string = req.params.model;
    try {
      const description = generic.getModelDescription(modelName);
      const response: GondolinResponse = {
        success: true,
        data: description
      };
      res.send(response)
    } catch (error) {
      const response: GondolinResponse = {
        success: false,
        error
      };
      res.send(response);
    }
  });

  app.get('/:model/get', (req: Request, res: Response) => {
    const modelName: string = req.params.model;
    const options = optionsFromQueryParams(req.query);
    generic.getAllEntities(modelName, options)
      .then(data => {
        const response: GondolinResponse = {
          success: true,
          data
        };
        res.send(response)
      })
      .catch(error => {
        const response: GondolinResponse = {
          success: false,
          error
        };
        res.send(response)
      });
  });

  app.get('/:model/get/:id', (req: Request, res: Response) => {
    const modelName: string = req.params.model;
    const id: number = req.params.id;
    const options = optionsFromQueryParams(req.query);
    generic.getEntityById(modelName, id, options)
      .then(data => {
        const response: GondolinResponse = {
          success: true,
          data
        };
        res.send(response)
      })
      .catch(error => {
        const response: GondolinResponse = {
          success: false,
          error
        };
        res.send(response)
      });
  });

  app.post('/:model/create', jwtMiddleWare, (req: Request, res: Response) => {
    const modelName = req.params.model;
    const {
      user,
      body: requestData
    } = req;
    if (!user) {
      const response: GondolinResponse = {
        success: false,
        message: 'Couldn\'t get user from request.'
      };
      res.status(403).json(response);
    }
    generic.createEntities(modelName, requestData, user)
      .then(data => {
        const response: GondolinResponse = {
          success: true,
          data
        };
        res.send(response)
      })
      .catch(error => {
        const response: GondolinResponse = {
          success: false,
          error
        };
        res.send(response)
      });
  });

  app.post('/:model/update', jwtMiddleWare, (req: Request, res: Response) => {
    const modelName = req.params.model;
    const {
      user,
      body: requestData
    } = req;
    if (!user) {
      const response: GondolinResponse = {
        success: false,
        message: 'Couldn\'t get user from request.'
      };
      res.status(403).json(response);
    }
    generic.updateEntities(modelName, requestData)
      .then(data => {
        const response: GondolinResponse = {
          success: true,
          data
        };
        res.send(response)
      })
      .catch(error => {
        const response: GondolinResponse = {
          success: false,
          error
        };
        res.send(response)
      });
  });

  app.post('/:model/delete', jwtMiddleWare, (req: Request, res: Response) => {
    const modelName = req.params.model;
    const {
      user,
      body: requestData
    } = req;
    if (!user) {
      const response: GondolinResponse = {
        success: false,
        message: 'Couldn\'t get user from request.'
      };
      res.status(403).json(response);
    }
    generic.deleteEntities(modelName, requestData)
      .then(data => {
        const response: GondolinResponse = {
          success: true,
          data
        };
        res.send(response)
      })
      .catch(error => {
        const response: GondolinResponse = {
          success: false,
          error
        };
        res.send(response)
      });
  });

};
