const environment = process.env.NODE_ENV || 'production';
const graphqlHTTP = require('express-graphql');

// Setup Sequelize
require('./sequelize.ts');

// Setup GraphQL
import graphqlSchema from './graphql';

// Setup Express
const app = require('./express.ts');

app.use('/graphql', graphqlHTTP({
  schema: graphqlSchema,
  graphiql: environment === 'development'
}));
