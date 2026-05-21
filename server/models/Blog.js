import mongoose, { Schema } from "mongoose";

const blogSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    content:{
        type:String,
        required:true
    },
    thumbnail:{
        type:String,
        default: "https://via.placeholder.com/800x400?text=Quillify+Blog",
    },
    category:{
        type:String,
        required:true,
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    status:{
        type:String,
        enum:["draft","pending","approved","rejected"],
        default:"draft"
    },
    isPublished:{
        type:Boolean,
        default:false,
    },
    isDeleted: {
    type: Boolean,
    default: false
   },
   views: {       
    type: Number,
    default: 0,
  },
  likes: [
    { 
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
    }
],
},{timestamps:true});

export default mongoose.model("Blog",blogSchema);