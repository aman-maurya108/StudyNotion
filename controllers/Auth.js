const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const OTP = require("../models/OTP");
const otpGenerator = require("otp-generator");
const Profile = require("../models/Profile");
const cookieParser = require("cookie-parser");
app.use(cookieParser());
require("dotenv").config();

//send OTP
exports.sendOTP = async(req,res) => {
    try {
    //fetch email from req.body
    const {email} = req.body;

    const checkUserPresent = await User.findOne({email});

    //check if user already exist, then return a response

    if(checkUserPresent){
        return res.status(401).json({
            success: false,
            message : 'User already present.',
        })    
    }
    //generate otp
    var otp = otpGenerator.generate(6,{
        upperCaseAlphabates : false,
        lowerCaseAlphabates : false,
        specialChars : false,
    });
    console.log("OTP generated",otp);

    //check unique otp or not
    const result = await OTP.findOne({otp : otp});

    while(result){ 
        otp = otpGenerator(6,{ 
            upperCaseAlphabates : false,
            lowerCaseAlphabates : false,
            specialChars : false,
        });
        result = await OTP.findOne({otp: otp});
    }
    const otpPayload = {email,otp};
    //create an entry for otp
    const otpBody = await OTP.create(otpPayload);
    console.log(otpBody);

    //return success response
    res.status(200).json({
        success : true,
        message : 'OTP sent successfully',
        otp,
    })

    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message : error.message,
        })
    }
}
// signup

exports.signUp = async(req,res) =>{
    try{
        //get data
        const {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            accountType,
            otp } 
             = req.body;
            // validate krna hai
            if(!firstName || !lastName || !email || !confirmPassword || !password || ! otp){
                return res.status(403).json({
                    success : false,
                    message : "All fields are required",
                })
            }
            // match both passwords
            if(password !== confirmPassword){
                return res.status(400).json({
                    success :false,
                    message : "Confirm password carefully. Try again!"
                })
            }
        //check if user already exist

        const existingUser = await User.findOne({email});

        if(existingUser){
            return res.status(400).json({
                success : false,
                message : 'User is already exists',
            });
        }

        // find most recent OTP stored for the user
        const recentOtp = await OTP.find({email}).sort({createdAt:-1}).limit(1);
        console.log(recentOtp);

        //validate OTP
        if(recentOtp.length == 0){
            //otp not found
            return res.status(400).json({
                success: false,
                message: 'OTP not found',
            })
        } else if(otp !== recentOtp[0].otp){
            // invalid otp
            return res.status(400).json({
                success : false,
                message: "Invalid OTP",
            });
        }
        //secure password
        const hashedPassword = await bcrypt.hash(password,10);

        const profileDetails = await Profile.create({
            gender : null,
            dateOfBirth : null,
            about : null,
            contactNumber : null
        })
        //create entry for User
        const user = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            accountType,
            additionalDetail: profileDetails._id,
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${Gyan} ${Verse}`,
        })

        return res.status(200).json({
            success:true,
            message: 'User created successfully',
        });
    }
    catch(error){
            console.error(error);
            return res.status(500).json({
                success:false,
                message:'User cannot be registered, please try again later',
            });
    }
}

// login

exports.login = async(req,res) =>{
    try{
        //data fetch
        const {email,password} = req.body;
        //validation on email and password
        if(!email || !password){
            return res.status(403).json({
                success :false,
                message:"Please fill the details carefully",
            });
        }
        let user = await User.findOne({email});//.populate("additionalDetails");
        //console.log(user);
        if(!user){
            return res.status(401).json({
                success: false,
                message: "User is not registered.Please SignUp first."
            });
        }

        const payload = {
            email : user.email,
            id : user._id,
            accountType: user.accountType,
        }

        //verify password and generate a JWT token
        if(await bcrypt.compare(password,user.password)){
            //password match
            //token generation
            let token = jwt.sign(payload,
                                    process.env.JWT_SECRET,
                                        {
                                            expiresIn : "2h",
                                        });
            user.token = token;
            user.password = undefined;
        
            const options = {
                expires: new Date(Date.now() + 3*24*60*60*1000),
                httpOnly : true,
            }
            res.cookie("hk_token",token,options).status(200).json({
                    success: true,
                    token,
                    user,
                    message: 'User Logged in successfully',
            });
                                        
        }
        else{
            return res.status(403).json({
                success: false,
                message: "Password Incorrect"
            });
        }
    }
    catch(error){
        console.error(error);
            return res.status(500).json({
                success:false,
                message:'Login Failure.Please try again.',
            });
    }
}


// change password 

