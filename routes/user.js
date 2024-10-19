const express = require('express')
const {  saveUser, deleteAllUsers, getUserByName, getAllUser, getUserById, login } = require('../controllers/user')
var router = express.Router()




//get all uses

router.get("/", getAllUser)


router.post('/signup',saveUser)


router.post('/login', login)


//lab
router.get("/search", getUserByName)

router.delete("/", deleteAllUsers)



//get user by id
router.get("/:id", getUserById)

module.exports = router