const { User, Thought } = require('../models')

// we need to set up the resolver that will serve the response for the typeDef query 
const resolvers = {
    Query: {
        thoughts: async (parent, { username }) => {
            const params = username ? { username } : {};
            return Thought.find(params).sort({ createdAt: -1 });
          },
          //finding a single though 
          thought: async (parent, { _id}) => {
              return Thought.findOne({_id});
          },
          //get all users
          users: async() => {
              return User.find()
              .select('-__v -password')
              .populate('friends')
              .populate('thoughts')
          },
          //get a user by username
          user: async (parent, { username}) => {
            return User.findOne({ username})
            .select('-__v -password')
            .populate('friends')
            .populate('thoughts')
          }
    }
    
}

module.exports = resolvers