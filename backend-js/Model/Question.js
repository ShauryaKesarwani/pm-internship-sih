const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
    internship: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Internship",
        required: true,
    },
    question: {
        type: String,
        required: true
    },
    answer : {
        type: String,
        required: true
    },
    difficulty:{
        type: String,
        required: true
    },
    weight: {
        type: Number,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Question = mongoose.model("Question", questionSchema);
module.exports = Question;