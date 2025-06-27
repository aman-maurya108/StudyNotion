const Course = require("../models/Course");
const Tag = require("../models/Tags");
const User = require("../models/User");
const {uploadImageToCloudinary} = require("../utils/imageUploader");

//createCourse handler 
exports.createCourse = async (req,res) => {
    try{
        // fetch data
        const {courseName, courseDescription,whatYouWillLearn , price ,tag} = req.body;

        //get thumbnail
         const thumbnail = req.files.thumbnailImage;
         // validation
         if(!courseName || !courseDescription || !whatYouWillLearn || !price || !tag || !thumbnail){
            return res.status(400).json({
                success : false,
                message: 'All fields are required',
            });
         }
         // check for instructor
         const userId = req.user.id;
         const instructorDetails = await User.findById(userId);
         console.log("instructor Details: ", instructorDetails);

         if(!instructorDetails){
            return res.status(400).json({
                success : false,
                message: 'Instructor Detail not found',
            });
         }

         //check given tag is valid or not
         const tagDetails = await Tag.findById(tag);
         if(!tagDetails){
            return res.status(400).json({
                success : false,
                message: 'Tag Detail not found',
            });
         }

         //upload image to cloudinary
         const thumbnailImage = await uploadImageToCloudinary(thumbnail,process.env.FOLDER_NAME);

         //create an entry for new course
         const newCourse = await Course.create({
            courseName,
            courseDescription,
            instructor : instructorDetails._id,
            whatYouWillLearn : whatYouWillLearn,
            price,
            tag : tagDetails._id,
            thumbnail : thumbnail.secure_url,
         });
         //add the new course to the user schema of the instructor
         await User.findByIdAndUpdate(
            {_id : instructorDetails._id},
            {
                $push: {
                    courses : newCourse._id
                }
            },
            {new : true}
         );
         //update tag schema
         return res.status(200).json({
            success :  true,
            message: "Course created successfully.",
            data: newCourse,
         })

        }
    catch(error){
        console.error(error);
        return res.status(400).json({
            success : false,
            message: 'Failed to create message',
            error : error.message,
        });

    }
}
/// show all courses

exports.showAllCourses = async(req,res) => { 
    try{
            // courseName : true,
            // price :true,
            // thumbnail : true,
            // instructor :true,
            // ratingAndReviews :  true,
            // studentsEnrolled: true,
        const allCourses = await Course.find({});

        return res.status(200).json({
            success: true,
            message: 'Data for all courses fetched successfully',
            data: allCourses
        })     
    }
    catch(error){
        console.error(error);
        return res.status(400).json({
            success : false,
            message: 'Failed to fetch courses',
            error : error.message,
        });
    }
}