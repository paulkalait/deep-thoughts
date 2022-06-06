// we need to set up the resolver that will serve the response for the typeDef query 
const resolvers = {
    Query: {
        helloWorld: () => {
            return 'Hello World'
        }
    }
}

module.exports = resolvers