

const express = require('express');
const cors=require('cors');
var todoRoutes=require('./routes/todo')
var userRoutes=require('./routes/user')
var todosModel=require('./models/todo');
const { connectToDatabase } = require('./db.connection');
require("dotenv").config()
const port = 3333


var app = express()

app.use(cors({
    origin:'*',
}))
app.use(express.json())

//handling routes
app.use("/user",userRoutes)
app.use('/todo',todoRoutes)

app.get('/',async function(_req,res){
    var todos= await todosModel.find()
    res.status(200).json({data:todos})
})

//not found
app.use('*',function(_req,res,_next){
  res.status(404).json({message:'Not found'})
})

connectToDatabase().then(() => {
    console.log("connected to DB");
}).catch((err) => {
    console.log(err);
})


app.listen(port, () => {
    console.log(`server listening successfully on port ${port}`);
})


module.exports= app