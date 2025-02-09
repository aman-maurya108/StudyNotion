const mongoose = require("mongoose");
require('dotenv').config();

const ratingAndReviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    review: {
        type: String,
        required: true,
    }
}, { timestamps: true });

module.exports = mongoose.model("RatingAndReview", ratingAndReviewSchema);
