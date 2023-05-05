const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
    },
    plan:{
        type:Boolean,
        default:false
    }
})


const UserModel = mongoose.model("user",userSchema)


module.exports={
    UserModel
}