import userModel from '../models/UserSchema.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

console.log("JWT Secret from .env:", process.env.JWT_SECRET);

const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, email: user.email, type: user.type },
        "jwttokensecretkey",// process.env.JWT_SECRET,
        { expiresIn: '23h' }
    );
};

export const registerUser= async(req,res)=>{
    try{
        const {name,email,password,phoneNumber,type}=req.body;
        const existingUser= await userModel.findOne({email});
        if(existingUser){
            return res.status(400).json({message:"User already exists"});
        }
        const hashedPassword= await bcrypt.hash(password,10);
        if(type==="Owner" || type==="owner"){

            const newUser= new userModel({
            name,
            email,
            password:hashedPassword,
            phoneNumber,
            type,
            PermissionStatus:"Ungrant"
        });
                await newUser.save();

        }
        else{

            const newUser= new userModel({
                name,
                email,
                password:hashedPassword,
                phoneNumber,
                type
            });
                    await newUser.save();

        }
      return res.status(201).json({message:"User registered successfully"});


    }catch(error){
        console.error("Error registering user:", error);
      return  res.status(500).json({message:"Internal server error"});
    }
}

export const loginUser= async(req,res)=>{
    try{
        const {email,password}=req.body;
        const user= await userModel.findOne({email});
        if(!user){
            return res.status(404).json({message:"User Not Found"});
        }   
        const isPasswordValid= await bcrypt.compare(password,user.password);
        if(!isPasswordValid){
            return res.status(400).json({message:"Invalid email or password"});
        }
        const token= generateToken(user);

        const resUser={
            _id:user._id,
            name:user.name,
            email:user.email,
            type:user.type,
            phoneNumber:user.phoneNumber,
            PermissionStatus:user.PermissionStatus
        }
        return res.status(200).json({message:"Login successful", resUser,token});

    }
    catch(error){
        console.error("Error logging in user:", error);
      return  res.status(500).json({message:"Internal server error"});
    }
}