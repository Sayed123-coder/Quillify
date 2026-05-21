import Blog from "../models/Blog.js";
import User from "../models/User.js";


export const getAllBlogs = async (req,res)=>{
    try{
        const blogs = await Blog.find().populate("author","name avatar");
        return res.status(200).json({blogs});
    }
    catch(err){
      return res.status(400).json({message:err.message});
    }
    
}

export const getBlogById=async(req,res)=>{
  try{
    const {id}=req.params;
    const blog=await Blog.findById(id).populate("author","name avatar");
    if(!blog){
      return res.status(404).json({message:"Blog Not Found"});
    }
    return res.status(200).json({blog});
  }
  catch(err){
     return res.status(400).json({message:err.message});
  }
}

export const getAllUsers = async (req,res) =>{
    try{
        const users=await User.find().select("-password");
        return res.status(200).json({users});
    }
    catch(err){
       return res.status(400).json({message:err.message}); 
    }
}

export const deleteAnyBlog = async (req,res) =>{
    try{
       
        const {id}=req.params;
        
        const blog=await Blog.findById(id);

        if(!blog){
           return res.status(404).json({message:"Cannot find the blog"});
        }

        const deletedBlog=await Blog.findByIdAndUpdate(
            id,
            {isDeleted:true,isPublished:false},
            {new:true},
        )
        
        return res.status(200).json({message:"Blog deleted",deletedBlog});

    }
    catch(err){
        return res.status(400).json({message:err.message});
    }
}

export const approveBlog=async (req,res)=>{
  try{
      const {id} =req.params;

      const blog=await Blog.findById(id);

      if(!blog){
        return res.status(404).json({message:"Blog Not Found"});
      }

      const approvedBlog=await Blog.findByIdAndUpdate(
        id,
        {status:"approved",isPublished:true},
        {new:true},
      )

     return res.status(200).json({message:"Blog Approved",approvedBlog});
  }
  catch(err){
    return res.status(400).json({message:err.message});
  }
}


export const rejectBlog=async(req,res)=>{
  try{
    const {id} =req.params;

      const blog=await Blog.findById(id);

      if(!blog){
        return res.status(404).json({message:"Blog Not Found"});
      }

      const rejectedBlog=await Blog.findByIdAndUpdate(
        id,
        {status:"rejected",isPublished:false},
        {new:true},
      )

     return res.status(200).json({message:"Blog Rejected",rejectedBlog});
  }
  catch(err){
     return res.status(400).json({message:err.message});  
  }
}


export const blockUser=async (req,res)=>{
    try{

      const {id}=req.params;
      const user=await User.findById(id);

      if(!user){
       return res.status(404).json({message:"User not found"});
      }

      const blockedUser=await User.findByIdAndUpdate(
        id,
        {isBlocked:true},
        {new:true}
      )

      return res.status(200).json({message:"User Blocked",blockedUser})
    }
    catch(err){
      return res.status(400).json({message:err.message});
    }
}

export const unblockUser=async (req,res)=>{
    try{

      const {id}=req.params;
      const user=await User.findById(id);

      if(!user){
       return res.status(404).json({message:"User not found"});
      }

      const unBlockedUser=await User.findByIdAndUpdate(
        id,
        {isBlocked:false},
        {new:true}
      )

      return res.status(200).json({message:"User Unlocked",unBlockedUser})
    }
    catch(err){
      return res.status(400).json({message:err.message});
    }
}
