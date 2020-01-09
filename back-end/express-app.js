//file for express setup
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose')


app.use(bodyParser.json());

app.get('/' , (req , res , next)=>{
    res.send('Hello World')
})

function runServer(){
    mongoose.connect(`mongodb+srv://${process.env.db_admin}:${process.env.db_password}@cluster0-taeyx.mongodb.net/${process.env.db_name}?retryWrites=true&w=majority` , { useNewUrlParser: true ,  useUnifiedTopology: true  })
    .then(()=>{
        app.listen(8000 , ()=> console.log('🚀 Server Running on Port 8000...'))
    }).catch(err=>{
        console.log(err)
    })
}

module.exports = {
    app: app,
    runServer: runServer
}