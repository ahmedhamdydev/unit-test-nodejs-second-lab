const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

var userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true,"Name is required"]
    },
    email: {
        type: String,
        required: [true,"Email is required"],
        unique: [true,"Email must be unique"]
    },
    password: {
        type: String,
        required: [true,"Password is required"],
    }
})


userSchema.pre('save', async function (next) {
    var salt = await bcrypt.genSalt(10)
    var hashedPassword = await bcrypt.hash(this.password, salt)
    this.password = hashedPassword
    next();
})

var userModel = mongoose.model('User', userSchema)
module.exports = userModel

