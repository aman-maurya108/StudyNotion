const User = require("../models/User");
const mailSender = require("../utils/mailSender");

//resetPasswordToken
exports.resetPasswordToken = async (req,res) => {
   try{ 
    //get email from req body
    const email  = req.body.email;
    //email varification
    const user = await User.findOne({email : email});
    if(!user){
        return res.json({
            success: false,
            message : "Your Email is not registered with us."
        });
    }
    //generate token
    const  token = crypto.randomUUID();
    //update user by adding token and expiration time
    const updatedDetails = await User.findOneAndUpdate(
        {email : email},
        {
            token : token,
            resetPasswordExpires : Date.now() + 5*60*1000,
        },
        {new : true}
    );
    //cretae url
    const url = `http://localhost:3000/update-password/${token}`;

    // send mail using url
    await mailSender(email,"Password Reset Link",`Password Reset Link ${url}`);

    //return response
    return res.json({
        success: true,
        message:"Email sent successfully.Check your email"
    })
}
catch(error){
    
        console.error(error);
        return res.status(500).json({
            success:false,
            message:'Something went wrong.Try again later.',
        });

}
    
}

//resetPassword -- DB me update
exports.resetPassword = async(req,res) => {
    try{
    //data fetch
    const {password,confirmPassword,token} = req.body;
    //validation
    if(password != confirmPassword){
        return res.json({
            duccess: false,
            message: " Password not matching",
        })
    }
    //get userDetails fron db using token
    const userDetails = await User.findOne({token : token});
    // if no entry - invalid token
    if(!userDetails){
        return res.json({
            duccess: false,
            message: " Token is invalid.",
        });
    }
    // token time check
    if(userDetails.resetPasswordExpires < Date.now()){
        return res.json({
            duccess: false,
            message: " Token is expired. Please regenerate token.",
        });
    }
    //hash password
    const hashedPassword = await bcrypt.hash(password,10);
    //update password
    await User.findOneAndUpdate(
        {token : token},
        {password : hashedPassword},
        {new : true},
    );
    //return response
    return res.json({
        duccess: true,
        message: " Password reset successfully.",
    })
}
catch(error){
    
    console.error(error);
    return res.status(500).json({
        success:false,
        message:'Something went wrong.Try again later.',
    });

}

}