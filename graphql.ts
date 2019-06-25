import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLInt,
  GraphQLList,
  GraphQLString
} from 'graphql';

import sequelize from './sequelize';

const {
  Application,
  User
} = sequelize.models;

import {
  attributeFields,
  resolver,
  JSONType
} from 'graphql-sequelize';

import Layer from './models/Layer';

const defaultListArgs = {
  limit: {
    type: GraphQLInt
  },
  order: {
    type: GraphQLString
  },
  where: {
    // TODO: I wonder why we need to add `default`
    type: JSONType.default
  }
};

const defaultSingleArgs = {
  id: {
    type: new GraphQLNonNull(GraphQLInt)
  }
};

const applicationType = new GraphQLObjectType({
  name: 'Application',
  description: 'An application',
  fields: attributeFields(Application)
});

const layerType = new GraphQLObjectType({
  name: 'Layer',
  description: 'A layer',
  fields: attributeFields(Layer)
});

const userType = new GraphQLObjectType({
  name: 'User',
  description: 'An user',
  fields: attributeFields(User),
});

export default new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      applications: {
        type: new GraphQLList(applicationType),
        args: {
          ...defaultListArgs
        },
        resolve: resolver(Application)
      },
      application: {
        type: applicationType,
        args: {
          ...defaultSingleArgs
        },
        resolve: resolver(Application)
      },
      layers: {
        type: new GraphQLList(layerType),
        args: {
          ...defaultListArgs
        },
        resolve: resolver(Layer)
      },
      layer: {
        type: layerType,
        args: {
          ...defaultSingleArgs
        },
        resolve: resolver(Layer)
      },
      users: {
        type: new GraphQLList(userType),
        args: {
          ...defaultListArgs
        },
        resolve: resolver(User)
      },
      user: {
        type: userType,
        args: {
          ...defaultSingleArgs
        },
        resolve: resolver(User)
      }
    }
  })
});
