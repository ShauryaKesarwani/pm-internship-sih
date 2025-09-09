const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    techStack: {
        type : [String],
    },
    link: {
        type: String,
        required : false,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }
}, { timestamps: true });

const Project = mongoose.model("Project", projectSchema);
module.exports = Project;