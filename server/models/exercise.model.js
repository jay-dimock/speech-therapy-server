const mongoose = require('mongoose');

const ExerciseSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: [true, "User ID is missing"],
        minlength: [8, "User ID is not long enough"],
    },

    category: {
        type: String,
        required: [true, "Category is missing"],
        minlength: [1, "Category is empty"],
    },

    words: [{type: String}],

}, {timestamps: true});

module.exports.Exercise = mongoose.model("Exercise", ExerciseSchema);