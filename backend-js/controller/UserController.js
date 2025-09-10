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


async function getResume(req, res){
    try {
        const user = await User.findById(req.user._id).select("resumeDoc");
        if (!user || !user.resumeDoc || !user.resumeDoc.path) {
            return res.status(404).json({ error: "Resume not found" });
        }

        const filePath = path.join(__dirname, "..", user.resumeDoc.path);
        return res.sendFile(filePath);
    } catch (err) {
        console.error("Resume fetch error:", err);
        return res.status(500).json({ error: "Server error" });
    }
}


async function uploadResume(req, res){
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        const userId = req.user._id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        user.resumeDoc = {
            filename: req.file.filename,
            path: `/uploads/docs/${req.file.filename}`,
            mimetype: req.file.mimetype,
            size: req.file.size,
            uploadedAt: new Date()
        };

        await user.save();


        const filePath = path.join(__dirname, "..", "uploads", "docs", req.file.filename);
        const parsedResume = await sendFileToBackend(filePath, userId);
        if (parsedResume) {
            updateResumeData(userId, parsedResume)
                .catch(err => console.error("Error updating resume:", err));
        }
        return res.status(200).json({
            message: "Resume uploaded successfully",
            resumeDoc: user.resumeDoc
        });
    } catch (err) {
        console.error("Resume upload error:", err);
        return res.status(500).json({ error: "Server error while uploading resume" });
    }
}

async function sendFileToBackend(filePath, userId) {
    try {
        const form = new FormData();

        // "file" must match the FastAPI UploadFile parameter name
        form.append("file", fs.createReadStream(filePath));  
        form.append("userId", userId.toString()); // extra text field

        const response = await axios.post("http://127.0.0.1:8000/parse-resume", form, {
            headers: {
                ...form.getHeaders(),
            },
            maxBodyLength: Infinity,
        });

        console.log("✅ File sent to FastAPI successfully:", response.data);
        return response.data;
    } catch (err) {
        console.error("❌ Error sending file to backend:", err.response?.data || err.message);
    }
}

async function updateResumeData(userId, parsedResume) {
    try {
        const user = await User.findById(userId).populate("resume.projects");

        if (!user) {
            throw new Error("User not found");
        }

        // --- Update skills ---
        if (parsedResume.resume.skills && parsedResume.resume.skills.length) {
            const newSkills = parsedResume.resume.skills.filter(
                skill => !user.resume.skills.includes(skill)
            );
            user.resume.skills.push(...newSkills);
        }

        // --- Update certifications ---
        if (parsedResume.resume.certifications && parsedResume.resume.certifications.length) {
            const newCerts = parsedResume.resume.certifications.filter(
                cert => !user.resume.certifications.includes(cert)
            );
            user.resume.certifications.push(...newCerts);
        }

        // --- Update social links ---
        if (parsedResume.resume.socialLinks && parsedResume.resume.socialLinks.length) {
            const newLinks = parsedResume.resume.socialLinks.filter(
                link => !user.resume.socialLinks.includes(link)
            );
            user.resume.socialLinks.push(...newLinks);
        }

        // --- Update projects ---
        if (parsedResume.resume.projects && parsedResume.resume.projects.length) {
            for (const projectStr of parsedResume.resume.projects) {
                // Check if project already exists in user's projects (by name)
                const exists = user.resume.projects.some(
                    p => p.title === projectStr
                );

                if (!exists) {
                    // Save new project in Project collection
                    const newProject = new Project({ title: projectStr });
                    await newProject.save();
                    user.resume.projects.push(newProject._id);
                }
            }
        }

        if (parsedResume.experience && parsedResume.experience.internships) {
            for (const internship of parsedResume.experience.internships) {
                const exists = user.experience.internships.some(
                    e => e.title === internship.title && e.company === internship.company
                );
                if (!exists) {
                    user.experience.internships.push(internship);
                }
            }
        }

        await user.save();
        console.log("Resume updated successfully!");
        return user;
    } catch (err) {
        console.error("Error updating resume:", err);
        throw err;
    }
}



module.exports = {
    profile,
    experience,
    companyProfile,
    getProjects,
    editProfile,
    addProject,
    getResume,
    uploadResume
}