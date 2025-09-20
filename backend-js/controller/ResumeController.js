const User = require("../Model/User");
const path = require("path");
const FormData = require("form-data");
const fs = require("fs");
const axios = require("axios");
const Project = require("../Model/Project");

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
            updateResumeData(userId, JSON.parse(parsedResume), req, res)
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

        console.log("File sent to FastAPI successfully:");
        console.log(response)
        return response.data;
    } catch (err) {
        console.error("Error sending file to backend:", err.response?.data || err.message);
    }
}

async function updateResumeData(userId, parsedResume, req, res) {
    try {
        console.log(parsedResume)
        const user = await User.findById(userId).populate("resume.projects");

        // --- Skills ---
        if (parsedResume.resume?.skills?.length) {
            user.resume.skills = Array.from(
                new Set([...user.resume.skills, ...parsedResume.resume.skills])
            );
        }

        // --- Certifications ---
        if (parsedResume.resume?.certifications?.length) {
            user.resume.certifications = Array.from(
                new Set([...user.resume.certifications, ...parsedResume.resume.certifications])
            );
        }

        // // --- Social Links ---
        // if (parsedResume.resume?.socialLinks?.length) {
        //     user.resume.socialLinks = Array.from(
        //         new Set([...user.resume.socialLinks, ...parsedResume.resume.socialLinks])
        //     );
        // }

        // --- Projects ---
        if (parsedResume.resume?.projects?.length) {
            for (const projectStr of parsedResume.resume.projects) {
                const exists = user.resume.projects.some(p => p.title === projectStr);
                if (!exists) {
                    const newProject = await Project.create({ title: projectStr, owner: req.user._id });

                    user.resume.projects.push(newProject._id);
                }
            }
        }

        // --- Experience (Internships) ---
        if (parsedResume.experience?.internships?.length) {
            for (const internship of parsedResume.experience.internships) {
                const exists = user.experience.internships.some(
                    e => e.title === internship.title && e.company === internship.company
                );
                if (!exists) {
                    user.experience.internships.push(internship);
                }
            }
        }

        // --- Phone Number (optional, update only if present) ---
        if (parsedResume.phoneNumber && !user.phoneNumber) {
            user.phoneNumber = parsedResume.phoneNumber;
        }

        await user.save();
        console.log("✅ Resume updated successfully!");
        return user;
    } catch (err) {
        console.error("❌ Error updating resume:", err);
        throw err;
    }
}


module.exports = {
    getResume,
    uploadResume,
}