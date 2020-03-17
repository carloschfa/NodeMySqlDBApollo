import graphql, { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLBoolean, GraphQLList, GraphQLSchema } from 'graphql'
import Db from './db'

const ObjectItem = new GraphQLObjectType({
  name: 'Object',
  description: 'This representes a Object.',
  fields: () => {
    return {
      objectId: {
        type: GraphQLString,
        resolve(objectItem) {
          return objectItem.objectId;
        }
      },
      category: {
        type: GraphQLString,
        resolve(objectItem) {
          return objectItem.category;
        }
      },
      text: {
        type: GraphQLString,
        resolve(objectItem) {
          return objectItem.text;
        }
      },
      number: {
        type:  GraphQLInt,
        resolve(objectItem) {
          return objectItem.number;
        }
      },
      boolean: {
        type: GraphQLBoolean,
        resolve(objectItem) {
          return objectItem.boolean;
        }
      },
      createdAt: {
        type: GraphQLString,
        resolve(objectItem) {
          return objectItem.createdAt;
        }
      },
      updatedAt: {
        type: GraphQLString,
        resolve(objectItem) {
          return objectItem.updatedAt;
        }
      },
    }
  }
});

const Query = new GraphQLObjectType({
  name: 'Query',
  description: 'This is a root query',
  fields: () => {
    return {
      objectItem: {
        type: new GraphQLList(ObjectItem),
        args: {
          category: {
            type: GraphQLString
          }
        },
        resolve(root, args) {

          console.log(Db.models);
          return Db.models.Objects.findAll({ where: args });
        }
      }
    }
  }
})

const Schema = new GraphQLSchema({
  query: Query
});

export default Schema;