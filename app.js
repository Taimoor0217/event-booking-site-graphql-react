const express = require('express');
const bodyParser = require('body-parser');
const graphqlhttp = require('express-graphql');
const {buildSchema} = require('graphql')
const app = express();
app.use(bodyParser.json());
// app.get('/' , (req , res , next)=>{
//     res.send('Hello World')
// })
app.use('/graphql' , graphqlhttp({
    //queries
    schema: buildSchema(` 
        type RootQuery {
            events: [String!]!
        }
        type RootMutation {
            createEvent(name: String!): String 
        }
        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    //resolvers
    rootValue: {
        events: function(){
            return ['Marrige' , 'Coding' , 'Dancing']
        },
        createEvent: function(args){
            console.log(args)
            return args.name;
        }
    },
    graphiql: true
}));
app.listen(8000 , ()=> console.log('🚀 Server Running on Port 8000...'))