const mongoose = require("mongoose");
require('dotenv').config();
const mailSender = require("../utils/mailSender");


const OTPSchema= new mongoose.Schema({
    email:{
        type:String,
        required : true,
       },
    otp:{
        type:String,
        required: true,
    },
    createdAt :{
        type:Date,
        default : Date.now(), //Date.now
        expires : 5*60,
    }
});

// a funcion to send mail
async function sendverificationEmail(email,otp){
    try{
        const mailResponse = await mailSender(email,"Verification email from StudyNotion",otp);
        console.log("Email sent successfully",mailResponse);
    }
    catch(error){
        console.log("Error occured while sending mails",error);
        throw error;
    }
}

OTPSchema.pre("save", async function(next){
    await sendverificationEmail(this.email,this.otp);
    next();
})


module.exports = mongoose.model("OTP",OTPSchema);