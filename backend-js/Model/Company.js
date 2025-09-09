const mongoose = require("mongoose");

const companySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email : {
        type : String,
        required: true,
    },
    uniqueName : {
        type: String,
        required: true,
    },
    password : {
        type : String,
        required : true,
    },
    description: {
        type : String,
    },
    industry: {
        type : String,
        required : true,
    },
    website: {
        type : String,
    },
    location: {
        type : String,
        required : true,
    },
    internships : [{
        type : mongoose.Schema.Types.ObjectId, ref: "Internship"
    }],
}, { timestamps: true });

const Company = mongoose.model("Company", companySchema);
module.exports = Company;