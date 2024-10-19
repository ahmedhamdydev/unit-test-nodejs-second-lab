const mongoose=require('mongoose')


var todoSchema=mongoose.Schema({
    title:{
        type:String,
        minLength:[3,"title is less than 3 characters"],
        maxLength:25,
        required:true,
        trim:true

    },
    status:{
        type:String,
        enum:["to do","doing","done"],
        default:"to do"
    },
    userId:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'User',
        required:true
    }
})


var todosModel= mongoose.model('Todo',todoSchema)

module.exports=todosModel