const express = require('express');
const bodyParser = require('body-parser');
const graphqlhttp = require('express-graphql');
const {buildSchema} = require('graphql')
const mongoose = require('mongoose')
const app = express();
app.use(bodyParser.json());
// let CurrentEvents = [];
const Event = require('./models/event')

app.get('/' , (req , res , next)=>{
    res.send('Hello World')
})
app.use('/graphql' , graphqlhttp({
    //queries
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
            // console.log(args.eventInput.name)
            const event = new Event({
                name: args.eventInput.name,
                description: args.eventInput.description,
                price: args.eventInput.price,
                attendes: args.eventInput.attendes,
                // _id : Math.random().toString(),
                date: new Date(args.eventInput.date)
            })
            event.save()
            .then((result)=>{
                console.log(result);
                return { ...result._doc };
            })
            .catch((err) => {
                console.log(err)
                throw err; 
            })
            // CurrentEvents.push(data)
        }
    },
    //for in browser graohql intrface, set this false on production mode    
    graphiql: true
}));
// console.log(process.env.db_admin , process.env.db_password)
mongoose.connect(`mongodb+srv://${process.env.db_admin}:${process.env.db_password}@cluster0-taeyx.mongodb.net/${process.env.db_name}?retryWrites=true&w=majority` , { useNewUrlParser: true ,  useUnifiedTopology: true  })
.then(()=>{
    app.listen(8000 , ()=> console.log('🚀 Server Running on Port 8000...'))
}).catch(err=>{
    console.log(err)
})