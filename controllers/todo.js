
var todosModel = require('../models/todo')

const getAllTodos = async (_req, res) => {
  try {
    var todos = await todosModel.find().populate('userId', "name")
    res.status(200).json({ data: todos });
  } catch (err) {
    res.status(500).json({ message: "Couldn't find todos try again" })
  }
}


const saveTodo = async (req, res) => {
  var title = req.body.title
  try {

    var newTodo = await todosModel.create({ title: title, userId: req.id })
    res.status(201).json({ data: newTodo })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}



const getTodoById = async (req, res) => {
  var { id } = req.params

  try {
    var todo = await todosModel.findOne({ _id: id })
    if (todo) {
      res.status(200).json({ data: todo })
    } else {
      res.status(404).json({ message: "todo not found" })
    }
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// for lab
const updateTitleTodoById = async (req, res) => {
  var { title } = req.body
  var { id } = req.params

  try {
    if (id && title) {
      var UpdatedTodo = await todosModel.findOneAndUpdate({ _id: id }, { title: title }, { new: true })
      res.status(200).json({ data: UpdatedTodo })
    }
    else res.status(400).json({ message: "must provide title and id to edit todo" })
  } catch (e) {
    res.status(400).json({ message: e.message })
  }
}


const getUserTodos = async (req, res) => {

  try {

    var todos = await todosModel.find({ userId: req.id })
    console.log('req.id: ', req.id);
    console.log('todos: ', todos);
    todos.length > 0 && res.status(200).json({ data: todos })
    todos.length == 0 && res.status(200).json({ message: "Couldn't find any todos for " + req.id })
  } catch (e) {
    res.status(400).json({ message: e.message })
  }
}


const deleteAllTodos = async (_req, res) => {
  try {
    await todosModel.deleteMany()
    res.status(200).json({ message: "todos have been deleted successfully" })
  } catch (e) {
    res.status(400).json({ message: e.message })
  }
}



module.exports = { getAllTodos, saveTodo, getTodoById, updateTitleTodoById, deleteAllTodos, getUserTodos }