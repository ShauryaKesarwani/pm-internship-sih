const User = require('../Model/User');
const Internship = require('../Model/Internship');
const Company = require('../Model/Company');
const Project = require("../Model/Project");
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const FormData = require("form-data");

async function profile(req, res) {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({message: "Unauthorized"});
        }

        const freshUser = await User.findById(user._id)
            .select("-auth0Id -password -internships -resume -experience")

        return res.json({
            success: true,
            user: freshUser,
        });

    } catch (err) {
        console.error(" user Profile error:");
        console.log(err)
        return res.status(500).json({error: "Server Error"});
    }
}


async function experience(req, res) {
    try {
        const userId = req.user._id;
        const { experience } = await User.findById(userId);
        if(!experience) {
            return res.status(404).json({message : "No experience Found"})
        }
        res.status(200).json({
            success : true,
            experience : experience
        })
    } catch (err) {
        console.error(" user experience error:");
        console.log(err)
        return res.status(500).json({error: "Server Error"});
    }
}


async function companyProfile(req, res) {
    try {
        const { companyId } = req.params;

        const company = await Company.findById(companyId)
            .select("-password -email")
            .populate({
                path: "internships",
                select: "internshipDetails status createdAt updatedAt"
            });

        if (!company) {
            return res.status(404).json({ message: "Company not found" });
        }

        return res.status(200).json({
            company
        });
    } catch (err) {
        console.error("Company profile error:", err);
        return res.status(500).json({ error: "Server Error" });
    }
}


async function getProjects(req, res) {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId).populate("resume.projects");

        if(!user || !user.resume || !user.resume.projects){
            return res.status(404).json({ message: "No Projects Found" });
        }

        const project = user.resume.projects;

        return res.status(200).json({
            project
        })
    } catch (err) {
        console.log("error in getProjects/ users");
        console.log(err);
        return res.status(500).json({ error: "Server Error" });
    }
}


async function editProfile(req, res) {
    try {
        const updates = req.body;
        const userId = req.user._id;

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updates,
            { new: true, runValidators: true }
        ).select("-password -auth0Id");

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({
            message: "Profile updated successfully",
            user: updatedUser,
        });
    } catch (err) {
        console.error("Error in editProfile:", err);
        return res.status(500).json({ error: "Server Error" });
    }
}


async function addProject(req, res) {
    try {
        const userId = req.user._id;
        const { name, description, techStack, link } = req.body;

        if (!name) {
            return res.status(400).json({ message: "Project name is required" });
        }

        const newProject = await Project.create({
            name,
            description,
            techStack,
            link,
            owner: userId,
        });

        await User.findByIdAndUpdate(userId, {
            $push: { "resume.projects": newProject._id },
        });

        return res.status(201).json({
            message: "Project added successfully",
            project: newProject,
        });
    } catch (err) {
        console.error("Error in addProject:", err);
        return res.status(500).json({ error: "Server Error!!" });
    }
}


module.exports = {
    profile,
    experience,
    companyProfile,
    getProjects,
    editProfile,
    addProject,
}