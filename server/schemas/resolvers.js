const { User, Thought } = require('../models')
const { AuthenticationError } = require('apollo-server-express')
const { signToken } = require('../utils/auth')

// we need to set up the resolver that will serve the response for the typeDef query 
const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if(context.user){
            const userData = await User.findOne({_id: context.user._id})
            .select('-__v -password')
            .populate('thoughts')
            .populate('friends')
            return userData
            }
            throw new AuthenticationError('Not Logged in')
            
        },

         thoughts: async (parent, { username }) => {
            const params = username ? { username } : {};
            return Thought.find(params).sort({ createdAt: -1 });
          },
          //finding a single thought
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
    },
    Mutation: {
        addUser: async (parent, args) =>{
            //Here, the Mongoose User model creates a new user in the database with whatever is passed in as the args
            const user = await User.create(args)
            const token = signToken(user)
            return { user, token} 
        },
        login: async (parent, { email, password}) => {
            const user = await User.findOne({email})


            if(!user){
                throw new AuthenticationError('Incorrect credentials')
            }
            const correctPw = await user.isCorrectPassword(password)

            if(!correctPw){
                throw new AuthenticationError('Incorrect Credentials');
            }
            const token = signToken(user)

            return {user, token};
        },
        addThought: async(parent, args, context) => {
            //Only logged-in users should be able to use this mutation, hence why we check for the existence of context.user first
            //decoded jwt is only added to contect if verrifaction passes. the tokem includes users username email , and _id properties
            if(context.user){
                const thought = await Thought.create({...args, username: context.user.username})
                await User.findByIdAndUpdate(
                    {
                        _id: context.user._id
                    },
                    {
                        $push: {thoughts: thought._id}
                    },
                    {new: true}
                )
                return thought
            }
            throw new AuthenticationError('You need to be logged in!')
         
        },
        addReaction: async (parent, { thoughtId, reactionBody}, context) => {
            if(context.user){
                const updatedThought = await Thought.findOneAndUpdate(
                    {
                        _id: thoughtId
                    },
                    {
                        $push: { reactions: { reactionBody, username: context.user.username}}
                    },
                    { new: true, runvalidators: true}
                )
                return updatedThought;
            }
            throw new AuthenticationError('You need to be logged in!')
        },
        addFriend: async (parent, {friendId}, context) => {
            if(context.user){
                const updatedUser = await User.findOneAndUpdate({
                    _id: context.user._id
                },
                {
                    //add to set prevents duplicate entries. a user cant  be friends with the same person twice
                    $addToSet: { friends: friendId}
                },
                { new: true}
                ).populate('friends')

                return updatedUser
            }
            throw new AuthenticationError('You need to be logged in!')
        },
   
        
    }
}


module.exports = resolvers