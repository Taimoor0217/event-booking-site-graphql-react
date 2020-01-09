//File for al graphql confgurations
const Event = require('./models/event')
const graphqlhttp = require('express-graphql');
const expressapp = require('./express-app');
const {buildSchema} = require('graphql')


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
        input EventInput {
            name: String!
            description: String
            date: String!
            price: Float!
            attendes: Int
        }
        
        type RootQuery {
            events: [Event!]!
        }
        type RootMutation {
            createEvent(eventInput: EventInput!): Event
        }
        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    //resolvers
    rootValue: {
        events: function(){
            return CurrentEvents;
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
        }
    },
    //for in browser graohql intrface, set this false on production mode    
    graphiql: true
}));
// console.log(process.env.db_admin , process.env.db_password)
expressapp.runServer()