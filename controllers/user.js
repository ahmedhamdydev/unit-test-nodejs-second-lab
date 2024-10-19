
var userModel = require('../models/user')

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


const getAllUser =async(_req, res) => {
    let users = await userModel.find()
    res.status(200).json({ data: users })
}

const saveUser=async (req, res) => {
    var user = req.body
    try {
        var newUser = await userModel.create(user)
        res.status(201).json({ data: newUser })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }

}
const login=  async function (req, res) {  

    var { email, password } = req.body
    if (!email || !password) {
        return res.status(400).json({ message: 'please provide email and password' })
    }

    try {

        var user = await userModel.findOne({ email })
        if (!user) {
            return res.status(401).json({ message: 'Invalid email' })
        }
        var isValid = await bcrypt.compare(password, user.password)

        if (!isValid) {
            return res.status(401).json({ message: 'Invalid email or password' })
        }

     var token = jwt.sign({ id: user._id, name: user.name }, process.env.SECRET)


      res.status(200).json({ data: token  })
    } catch (err) {
        res.status(400).json({ message: err.message })
    }


}

const getUserById=async(req, res) => {       
    let user = await userModel.findOne({ _id:req.params.id })
    res.status(200).json({ data: user })
}




//lab
const getUserByName= async (req, res) => {
    try {
        var {name} = req.query
        var user = await userModel.findOne({ name })
        if (user) res.status(200).json({data:user})
        else {
            res.status(200).json({ message: "There is no user with name: " + name })
        }
    } catch (e) {
        res.status(400).json({ message: e.message })
    }
}
   
const deleteAllUsers=async (_req, res) => {
    try {
        await userModel.deleteMany()
        res.status(200).json({ message: "users have been deleted successfully" })
    } catch (e) {
        res.status(400).json({ message: e.message })
    }
}

module.exports = { saveUser, getAllUser, getUserByName,deleteAllUsers,getUserById,login }