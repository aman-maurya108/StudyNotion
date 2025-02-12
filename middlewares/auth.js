
const User = require("../models/User");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.auth = (req,res,next) =>{
   try{
              
    const token = req.header("Authorization")?.replace("Bearer ", "") || req.body.token || req.cookies.token;


       if(!token){
           return res.status(400).json({
               success : false,
               message : 'Token Missing.',
        });
       }
       //verify token
       try{
           const decode = jwt.verify(token,process.env.JWT_SECRET);
           console.log(decode);
           
           req.user = decode;
           
       }

       catch(error){
           return res.status(401).json({  
               success : false,
               message : 'INVALID Token.',
        });
       }
       next();
   } 
   catch(error){
       return res.status(401).json({
           success : false,
           message : 'Something went wrong while verifying the token.',
    });
   }
}


//is student
exports.isStudent = (req,res,next) =>{
       try{
           if(req.user.accountType != "Student"){
               return res.status(401).json({
                   success : false,
                   message : 'This is protected route for Students.',
            });
           }
           next();
       }
       catch(error){
           return res.status(500).json({
               success : false,
               message : 'User role is not matching.Try again.',
        });
       }
}

//is Instructor

exports.isInstructor = (req,res,next) =>{
    try{
        if(req.user.accountType != "Instructor"){
            return res.status(401).json({
                success : false,
                message : 'This is protected route for Instructor.',
         });
        }
        next();
    }
    catch(error){
        return res.status(500).json({
            success : false,
            message : 'User role is not matching.Try again.',
     });
    }
}


//is admin
exports.isAdmin = (req,res,next) =>{
   try{
       if(req.user.accountType != "Admin"){
           return res.status(401).json({
               success : false,
               message : 'This is protected route for admin.',
        });
       }
       next();
   }

   catch(error){
       return res.status(500).json({
           success : false,
           message : 'User role is not matching.',
    });
   }
}
