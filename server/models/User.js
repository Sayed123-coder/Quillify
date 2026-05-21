import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
    },
    role:{
        type:String,
        enum:["user","admin"],
        default:"user",
    },
    avatar:{
        type:String,
    },
    googleId:{
        type:String,
    },
    isBlocked:
     { 
        type: Boolean, 
        default: false,
    }

},{timestamps:true});

export default mongoose.model("User",userSchema);