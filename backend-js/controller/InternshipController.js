const Company = require("../Model/Company");
const Internship = require("../Model/Internship");
const Application = require("../Model/Application");
require('dotenv').config();


async function createInternship(req, res) {
    try {
        console.log(0)
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
            eligibility
        } = req.body;

        console.log(1)
        if (!title || !responsibilities || !duration) {
            return res.status(400).json({ message: "Title, description, and duration are required" });
        }

        console.log(2)
        const newInternship = await Internship.create({
            internshipDetails: {
                title,
                department,
                responsibilities,
                skillsRequired,
                openings,
                duration,
                applicationDeadline,
                location,
                stipend,
            },
            eligibility,
            company: req.session.companyId,
        })

        console.log(3)
        return res.status(201).json({
            message: "Internship created successfully",
            newInternship
        });
    } catch (err) {
        console.log("error in post Internship");
        return res.status(500).json({ error: "Server Error!!" });
    }
}


async function getPostedInternships(req, res) {
    try {
        console.log(1)
        const internships = await Internship.find({ company: req.session.companyId })
            .populate("applications")
            .populate("assignments");


        console.log(2)
        if(!internships) {
            return res.status(401).json({ message: "No Internship Found" });
        }

        console.log(3)
        console.log(internships)
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
        console.error("error in geting application");
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
}


async function getApplicantProfile(req, res) { //sending all the data, configure it later
    try {
        const applicationId = req.params.applicationId;

        const application = await Application.findById(applicationId)
            .populate("applicant");

        if (!application) {
            return res.status(404).json({ message: "Applicant not found" });
        }

        const internship = await Internship.findById(application.internship);
        if (internship.company.toString() !== req.session.companyId) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        return res.status(200).json({
            message: "Applicant profile fetched",
            applicant: application.applicant,
            answers: application.answers,
            documents: application.documents,
            status: application.status,

        });

    } catch (err) {
        console.error("error in getApplicantProfile:");
        console.log(err)
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


module.exports = {
    createInternship,
    getPostedInternships,
    closeApplications,
    getApplicants,
    getApplicantProfile,
    updateInternshipDetails,
    deleteInternship,
    internshipDetails
}
