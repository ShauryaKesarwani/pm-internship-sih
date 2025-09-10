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
        console.log(parsedResume)
        console.log(1)
        const user = await User.findById(userId).populate("resume.projects");

        console.log(2)
        // --- Update skills ---
        if (parsedResume.resume.skills?.length) {
            user.resume.skills = Array.from(
                new Set([...user.resume.skills, ...parsedResume.resume.skills])
            );
        }

        console.log(3)
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
    getResume,
    uploadResume,
}