import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async(req,res)=>{
    try{
        const {name,email,password}=req.body;

        if(!name || !email || !password){
          return res.status(400).json({message:"Please provide all the details"});
        }

        const existingUser= await User.findOne({email})

        if(existingUser){
            return res.status(400).json({message:"User already exists"});
        }

        const hashedPass= await bcrypt.hash(password,10);

        const user=await User.create({
            name,
            email,
            password:hashedPass,
        })

        const token = jwt.sign(
            {id:user._id,role:user.role},
            process.env.JWT_SECRET,
            {expiresIn:"7d"}
        );

        return res.status(200).json({
            token,
            user:{
                id:user._id,
                name:user.name,
                email:user.email,
                role:user.role
            }
        })
        
    }
    catch(err){
        return res.status(500).json({message:err.message});
    }
    

}


export const login =async(req,res)=>{
    try{
       
       const {email,password}=req.body;

       if(!email || !password){
         return res.status(400).json({message:"Please provide all the details"});
       }

       const user=await User.findOne({email});

       if(!user){
         return res.status(400).json({message:"User not found.Please signup"});
       }

       const isMatch=await bcrypt.compare(password,user.password);

       if(!isMatch){
         return res.status(400).json({message:"Invalid Credentials"});
       }

       const token=await jwt.sign(
        {id:user._id,role:user.role},
        process.env.JWT_SECRET,
        {expiresIn:"7d"},
       )

       res.status(200).json({
        token,
        user:{
            id:user._id,
            name:user.name,
            email:user.email,
            role:user.role
        }
       })
    }
    catch(err){
        return res.status(500).json({message:err.message});
    }
}