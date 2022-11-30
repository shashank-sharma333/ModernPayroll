const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    name : {type: String , require},
    email : {type: String , require},
    password : {type: String , require},
    role : {type: String , require},
    walletId : {type: String , require},
    isPayrollRegistered : {type: Boolean , require , default: false},
    salary : {type: String , require , default: '0'}
} , {
    timestamps : true
})

module.exports = mongoose.model('users' , userSchema)