//File for al graphql confgurations
const Event = require('./models/event');
const User = require('./models/user');
const graphqlhttp = require('express-graphql');
const expressapp = require('./express-app');
const {buildSchema} = require('graphql')
const bcrypt = require('bcryptjs')
expressapp.app.use('/graphql' , graphqlhttp({
    //queriesapp.
    schema: buildSchema(` 
        type Event {
            _id: ID
            name: String!
            description: String
            date: String!
            price: Float!
            attendes: Int
        }

        type User {
            _id: ID!
            email: String!
            name: String!
            password: String
        }

        input EventInput {
            name: String!
            description: String
            date: String!
            price: Float!
            attendes: Int
        }

        input UserInput {
            name: String!
            password: String!
            email: String!
        }
        
        type RootQuery {
            events: [Event!]!
        }
        type RootMutation {
            createEvent(eventInput: EventInput!): Event
            createUser(userInput: UserInput!): User
        }
        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    //resolvers
    rootValue: {
        events: function(){
            return Event.find()
            .then((value) => {
                return value.map(event=>{
                    return {...event._doc};
                })
            })
            .catch(err=>{
                console.log(err)
                throw err
            })
        },
        createEvent: function(args){
            const event = new Event({
                ...args.eventInput,
                date: new Date(args.eventInput.date)
            })
            return event.save()
            .then((result)=>{
                console.log(result);
                return { ...result._doc };
            })
            .catch((err) => {
                console.log(err)
                throw err; 
            })
        },
        createUser: function(args){
            return bcrypt.hash(args.userInput.password , 12)
            .then(hashedpass=>{
                const user = new User({
                    ...args.userInput,
                    password: hashedpass
                })
                return user.save();
            })
            .then(result=>{
                return{
                    ...result._doc , 
                    _id: result.id,
                    password: null
                }
            })
            .catch(err=>{
                throw err;
            });

        }
    },
    //for in browser graohql intrface, set this false on production mode    
    graphiql: true
}));
// console.log(process.env.db_admin , process.env.db_password)
expressapp.runServer()