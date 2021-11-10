const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLInt,
    GraphQLNonNull } = require('graphql');
const app = express();

const locations = [
    { id: 1, name: 'Honolulu-1', managerId: 1 },
    { id: 2, name: 'Honolulu-2', managerId: 1 },
    { id: 3, name: 'Los Angeles-1', managerId: 2 },
    { id: 4, name: 'Denver-1', managerId: 3 },
    { id: 5, name: 'Denver-2', managerId: 3 },
    { id: 6, name: 'Denver-3', managerId: 3 }
]

const managers = [
    { id: 1, name: 'George Tang' },
    { id: 2, name: 'Adam Smith' },
    { id: 3, name: 'Peter Griffin' },
]

const LocationType = new GraphQLObjectType({
    name: 'Location',
    description: 'This represents a company location',
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLInt) },
        name: { type: GraphQLNonNull(GraphQLString) },
        managerId: { type: GraphQLNonNull(GraphQLInt) },
        manager: {
            type: ManagerType,
            resolve: (location) => {
                return managers.find(manager => manager.id === location.managerId)
            }
        }
    })
})

const ManagerType = new GraphQLObjectType({
    name: 'Manager',
    description: 'This represents a location\'s manager',
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLInt) },
        name: { type: GraphQLNonNull(GraphQLString) },
        managedLocations: {
            type: new GraphQLList(LocationType),
            resolve: (manager) => {
                return locations.filter(location => location.managerId === manager.id)
            }
        }

    })
})

const RootQueryType = new GraphQLObjectType({
    name: "Query",
    description: "Root Query",
    fields: () => ({
        location: {
            type: LocationType,
            description: "A single location",
            args: {
                id: { type: GraphQLInt }
            },
            resolve: (parent, args) => locations.find(location => location.id === args.id)
        },
        manager: {
            type: ManagerType,
            description: "A single manager",
            args: {
                id: { type: GraphQLInt }
            },
            resolve: (parent, args) => managers.find(manager => manager.id === args.id)
        },
        locations: {
            type: new GraphQLList(LocationType),
            description: "list of all locations",
            resolve: () => locations
        },
        managers: {
            type: new GraphQLList(ManagerType),
            description: "list of all managers",
            resolve: () => managers
        }
    })
})

const RootMutationType = new GraphQLObjectType({
    name: 'Mutation',
    description: 'Root Mutation',
    fields: () => ({
        addLocation: {
            type: LocationType,
            description: "add new location",
            args: {
                name: { type: GraphQLNonNull(GraphQLString) },
                managerId: { type: GraphQLNonNull(GraphQLInt) }
            },
            resolve: (parent, args) => {
                const location = { id: locations.length + 1, name: args.name, managerId: args.managerId }
                locations.push(location)
                return location
            }

        },
        addManager: {
            type: ManagerType,
            description: "Add new manager",
            args: {
                name: { type: GraphQLNonNull(GraphQLString) },
            },
            resolve: (parent, args) => {
                const manager = { id: managers.length + 1, name: args.name }
                managers.push(manager)
                return manager
            }
        }
    })
})

const schema = new GraphQLSchema({
    query: RootQueryType,
    mutation: RootMutationType

})

app.use('/graphql', graphqlHTTP({
    graphiql: true,
    schema: schema
}));
app.listen(5000, () => console.log("server running"));