const bcrypt = require("bcrypt");
const Company = require('../Model/Company');
const Internship = require("../Model/Internship");
require('dotenv').config();


async function signUp(req, res) {
    try {
        const body = req.body;
        const email = body.email;
        const uniqueName = body.uniqueName;

        if(!email || !uniqueName) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        const userInDb = await Company.findOne({
          email: email
        });

        if(userInDb)  return res.status(400).json({ message: 'Company credentials already exists' });

        const password = await bcrypt.hash(body.password, 10);

        const user = await Company.create({
            name : body.companyName,
            password : password,
            uniqueName : uniqueName,
            email : email,
            description : body.description || "",
            industry : body.industry || "",
            website : body.website || "",
            location : body.location || "",
        })

        return res.status(201).json({
            message: "User SignUp Sucessful",
            user,
        });
    } catch (signup_error) {
        console.log(signup_error);
        return res.status(500).json({status: "Something went wrong, please try again later."})
    }
}

async function loginCompany(req, res) {
    try {
        const {uniqueId, email, password} = req.body;
        if((!email || !uniqueId) && !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        let query = {};
        if (email) query.email = email;
        if (uniqueId) query.uniqueId = uniqueId;

        const companyInDb = await Company.findOne(query);
        const isPassValid = await bcrypt.compare(password, companyInDb.password);

        if(!companyInDb || !isPassValid) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }
        req.session.companyId = companyInDb._id;
        req.session.uniqueName = companyInDb.uniqueName;

        return res.json({
            message : "Login Successful",
            company : {
                id: companyInDb._id,
                uniqueName: companyInDb.uniqueName,
                email: companyInDb.email
            }
        });
    } catch (err) {
        console.log("in company login func")
        console.log(err)
        return res.status(500).json({ error: 'Server Error' });
    }
}

async function getCompanyProfile(req, res) {
    try {
        const companyId = req.session.companyId;
        const company = await Company.findById(companyId).select("-password -internships");
        if(!company) {
            return res.status(404).json({message : "Company not found, please login again"});
        }
        return res.status(201).json({
            message : "Profile fetching successful",
            company
        })
    } catch (err) {
        console.log("profile fetching error")
        console.log(err);
        return res.status(404).json({error : "Server error, please login again"});
    }
}


async function updateCompanyProfile(req, res) {
    try {
        const updates = req.body;
        const companyId = req.session.companyId;
        const companyUpdate = await Company.findByIdAndUpdate(companyId,
            updates,
            {new : true, runValidators : true}
        );
        if(!companyUpdate) {
            return res.status(404).json({message : "Company not found"});
        }
        return res.status(201).json({
            message : "Company update successful",
        })
    } catch (err) {
        console.log("updating company profile error")
        console.log(err);
        return res.status(404).json({error : "Server error"});
    }
}

module.exports = {
    loginCompany,
    getCompanyProfile,
    updateCompanyProfile,
    signUp
}