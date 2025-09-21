const Company = require("../Model/Company");
const Internship = require("../Model/Internship");
const Application = require("../Model/Application");
const User = require("../Model/User");
require('dotenv').config();


async function createInternship(req, res) {
    try {
        const {
            title,
            department,
            responsibilities,
            skillsRequired,
            openings,
            duration,
            applicationDeadline,
            location,
            stipend,
            eligibility,
            pastInternshipId,
        } = req.body;

        if (!title || !responsibilities || !duration) {
            return res.status(400).json({ message: "Title, description, and duration are required" });
        }

        let exSkills = {
            pastHired: [],
            currHired: [],
        };

        if (pastInternshipId) {
            const pastInternship = await Internship.findById(pastInternshipId);
            if (pastInternship) {
                exSkills.pastHired = pastInternship.internshipDetails.skillsRequired || [];
            }
        }

        const newInternship = await Internship.create({
            internshipDetails: {
                title: title || "",
                department: department || "",
                responsibilities: responsibilities || [],
                skillsRequired: skillsRequired || [],
                openings: openings || 0,
                duration: duration || "",
                applicationDeadline: applicationDeadline || null,
                location: {
                    address: location?.address || "",
                    pinCode: location?.pinCode || 0,
                    city: location?.city || ""
                },
                stipend: stipend || ""
            },
            eligibility: eligibility || {},
            company: req.session.companyId,
            exSkills
        });

        return res.status(201).json({
            message: "Internship created successfully",
            newInternship
        });
    } catch (err) {
        console.error("Error in createInternship:", err);
        return res.status(500).json({ error: "Server Error!!" });
    }
}


async function getPostedInternships(req, res) {
    try {
        const internships = await Internship.find({ company: req.session.companyId })
            .populate("applications")
            .populate("assignments");


        if(!internships) {
            return res.status(401).json({ message: "No Internship Found" });
        }

        return res.status(200).json({
            message: "Fetched posted internships",
            count: internships.length,
            internships
        });

    } catch (err) {
        console.error("error in created Internships");
        console.log(err);
        return res.status(500).json({ message: "Server error" });
    }
}


async function closeApplications(req, res) { //thinking of it as the company will get lists of internships and a button with them to turn on and off
    try {
        const {internshipId} = req.params;
        const internship = await Internship.findById(internshipId);
        if (!internship) {
            return res.status(404).json({ message: "Internship not found" });
        }
        internship.status = !internship.status;
        await internship.save();

        return res.status(200).json({
            message: `Applications ${internship.status ? "opened" : "closed"} successfully`,
            internship
        });

    } catch (err) {
        console.error("error in close application");
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
}


async function getApplicants(req, res) {
    try {
        const {internshipId} = req.params;
        // const internship = await Internship.findById(internshipId);
        const internship = await Internship.findOne({
            _id: internshipId,
        }).populate({
            path: "applications",
            populate: { path: "applicant", select: "name email" }
        });

        const applications = internship.applications;

        return res.status(200).json({
            message: "Applicants found",
            count: applications.length,
            applications
        });
    } catch (err) {
        console.error("error in getting application");
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
}


async function getApplicantProfile(req, res) {
    try {
        const { applicationId } = req.params;

        const application = await Application.findById(applicationId)
            .populate("applicant")
            .populate("internship");

        if (!application) {
            return res.status(404).json({ message: "Application not found" });
        }

        if (!req.session.companyId) {
            return res.status(401).json({ message: "Unauthorized: Please log in" });
        }

        if (!application.internship || application.internship.company.toString() !== req.session.companyId) {
            return res.status(403).json({ message: "Unauthorized: You do not own this internship" });
        }

        return res.status(200).json({
            message: "Applicant profile fetched",
            applicant: application.applicant,
            answers: application.answers || [],
            documents: application.documents || [],
            status: application.status,
        });

    } catch (err) {
        console.error("error in getApplicantProfile:", err);
        return res.status(500).json({ message: "Server error" });
    }
}


async function internshipDetails(req, res) {
    try {
        const {internshipId} = req.params;

        const internship = await Internship.findById(internshipId);
        if(!internship) {
            return res.status(404).json({message : "No Internship Found for this ID"})
        }
        return res.status(200).json({
            internship : internship,
        })
    } catch (err) {
        console.error(" company complete internship error:");
        console.log(err)
        return res.status(500).json({error: "Server Error"});
    }
}


async function updateInternshipDetails(req, res) {
    try {
        const { internshipId } = req.params;
        const { description, openings, applicationDeadline, title } = req.body;

        const updates = [];
        if(description) updates.push(description);
        if(title) updates.push(title);
        if(applicationDeadline) updates.push(applicationDeadline);
        if(openings) updates.push(openings);

        const updatedInternship = await Internship.findByIdAndUpdate(
            internshipId,
            updates,
            { new: true, runValidators: true }
        );

        if (!updatedInternship) {
            return res.status(404).json({ message: "Internship not found" });
        }

        return res.status(200).json({
            message: "Internship updated successfully",
            internship: updatedInternship,
        });
    } catch (err) {
        console.log("error in edit Internship");
        console.log(err);
        return res.status(500).json({ error: "Server Error!!" });
    }
}


async function deleteInternship(req, res) {
    try {
        const {internshipId} = req.param;
        if(!internshipId) {
            return res.status(404).json({ message: "param provided is null" });
        }
        const internship = await Internship.findByIdAndDelete(internshipId);
        if(!internship) {
            return res.status(404).json({ message: "Internship not found" });
        }
        await Application.deleteMany({ internship: internshipId });

        return res.status(204).json({
            message: "Internship deleted successfully",
        });
    } catch (err) {
        console.log("error in delete Internship");
        console.log(err);
        return res.status(500).json({ error: "Server Error!!" });
    }
}


async function acceptIntern(req, res) {
    try {
        const { internshipId, userId } = req.params;

        if (!internshipId || !userId) {
            return res.status(400).json({ message: "internshipId and userId are required" });
        }

        const internship = await Internship.findById(internshipId);
        if (!internship) {
            return res.status(404).json({ message: "Internship not found" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!internship.currentInterns.includes(userId)) {
            internship.currentInterns.push(userId);
        }

        if (user.resume?.skills?.length > 0) {
            internship.exSkills.currHired.push(...user.resume.skills);
            internship.exSkills.currHired = [...new Set(internship.exSkills.currHired)];
        }

        user.internships.currentInternship = internship._id;

        const internshipSummary = {
            title: internship.internshipDetails.title,
            company: internship.company.toString(),
            duration: internship.internshipDetails.duration,
            description: internship.internshipDetails.responsibilities.join(", ")
        };

        const alreadyExists = user.experience.internships.some(
            exp => exp.title === internshipSummary.title && exp.company === internshipSummary.company
        );
        if (!alreadyExists) {
            user.experience.internships.push(internshipSummary);
        }

        await internship.save();
        await user.save();

        return res.status(200).json({
            message: "User accepted, skills added, and user profile updated",
            internshipExSkills: internship.exSkills,
            userExperience: user.experience
        });

    } catch (err) {
        console.error("Error in acceptIntern:", err);
        return res.status(500).json({ error: "Server Error" });
    }
}


module.exports = {
    createInternship,
    getPostedInternships,
    closeApplications,
    getApplicants,
    getApplicantProfile,
    updateInternshipDetails,
    deleteInternship,
    internshipDetails,
    acceptIntern,
}
