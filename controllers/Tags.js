const Tag = require("../models/Tags");
//create tag handler

exports.createTag = async(req,res) => {
    try{
        const {name, description} = req.body;

        if(!name || ! description){
            return res.status(400).json({
                success: false,
                message : "All fields are necessary."
            });
        }
        //create entry in DB
        const tagDetails = await Tag.create({
            name: name,
            description : description,
        });
        return res.status(200).json({
            success: true,
            message:"Tag created successfully."
        })

    }
    catch(error){
        console.error(error);
        return res.status(500).json({
            success:false,
            message: error.message
        });
    }
}

//
exports.showAllTags = async (req,res) =>{
    try{
        const allTags = await Tag.find({},{name:true,description : true});
        return res.status(200).json({
            success: true,
            message:"All Tags returned successfully.",
            allTags
        });
    }
    catch(error){
        console.error(error);
        return res.status(500).json({
            success:false,
            message: error.message
        });
    }
}