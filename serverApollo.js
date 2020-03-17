//
// The server was hosted at AWS EC2 South America Server, some delay may occur depending on network circunstances.
//
//
// Required libraries imports.
//
import Db from './db'
const Op = require('sequelize').Op;
const { ApolloServer, gql } = require("apollo-server");
const { PubSub } = require('apollo-server');
const pubsub = new PubSub();

//
// MongoDB GraphQL Schema.
//
const typeDefs = gql`
  type Subscription {
    objects: [Object]
  }
  
  type Object {
    objectId: String!
    category: String
    text: String!
    number: Int!
    boolean: Boolean!
    createdAt: String
    updatedAt: String
  }

  type Query {
    objects: [Object]!
    objectsByCategories(category: [String]): [Object]
  }

  type Mutation {
    insertObject(objectId: String!, category: String!, text: String!, number: Int!, boolean: Boolean!, createdAt: String!): MutationResponse!
    updateObject(objectId: String!, text: String!, number: Int!, boolean: Boolean!, updatedAt: String!): MutationResponse!
    deleteObject(objectId: String!): MutationResponse!
  }

  type MutationResponse {
    success: Boolean!
    message: String!
  }

`;  

//
// Constant name for socket subscription.
//
const OBJECT_CHANGED = 'objects'

//
// Filter used for returning objects from query.
//
let mainFilter = {
  category: {  
    $in: []
  }
}

//
// Main functions contemplating the CRUD operation along with the Apollo publisher.
//
const resolvers = {
  Subscription: {
    objects: {
      subscribe: () => pubsub.asyncIterator([OBJECT_CHANGED])
    }
  },
  Query: {
    objects: async () => {
      let objects = await Db.models.Objects.findAll();
      return objects
    },
    objectsByCategories: async (root, category) => {
      let filter =  { 
        category: {  
          [Op.in]: category.category
        }
      }
      let objects = await Db.models.Objects.findAll({ where: filter });
      return objects
    }
  },
  Mutation: {
    insertObject: async (root, args, context, info) => {
      let res = await Db.models.Objects.create(args)
      if (res) {
        let objects = await Db.models.Objects.findAll();
        await pubsub.publish(OBJECT_CHANGED, { objects: objects })
        return { success: true, message: 'Data was inserted.' }
      }
    },
    updateObject: async (root, args, context, info) => {
      const filter = { where: { objectId: args.objectId } }
      const data = { 
        text: args.text,
        number: args.number,
        boolean: args.boolean,
        updatedAt: args.updateAt
      }
      let res = await Db.models.Objects.update(data, filter)
      if (res) {
        let objects = await Db.models.Objects.findAll();
        await pubsub.publish(OBJECT_CHANGED, { objects: objects })
        return { success: true, message: 'Data was updated.' }
      }
    },
    deleteObject: async (root, args, context, info) => {
      const filter = { where: { objectId: args.objectId } }
      let res = await Db.models.Objects.destroy(filter)
      if (res) {
        let objects = await Db.models.Objects.findAll();
        await pubsub.publish(OBJECT_CHANGED, { objects: objects })
        return { success: true, message: 'Data was deleted.' }
      }
    }
  }
}

//
// Apollo Server instantiation.
// 
const server = new ApolloServer({
  typeDefs,
  resolvers
});

//
// Apollo Server initiator.
//
server.listen(3001).then(({ url }) => console.log(`Server running at ${ url } and subscriptions at ${ server.subscriptionsPath }`));