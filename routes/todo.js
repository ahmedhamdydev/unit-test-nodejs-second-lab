
const express=require('express')
var router=express.Router()
var {getAllTodos,saveTodo,getTodoById, updateTitleTodoById, getUserTodos, deleteAllTodos}=require('../controllers/todo')
var auth=require('../middlewares/auth')


//get all todos
router.route("/").get(getAllTodos).post(auth,saveTodo).delete(auth,deleteAllTodos)


//lab
//update todo by id
router.patch("/:id",auth, updateTitleTodoById)

//get all todos for user=> id
router.get("/user",auth, getUserTodos)



//get todo by id
router.get("/:id",auth,getTodoById)
module.exports=router