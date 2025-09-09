const User = require("../Model/User");
const Internship = require("../Model/Internship");
const Company = require("../Model/Company");


async function ongoingInternship(req, res) {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId)
            .populate({
                path: "internships.currentInternship",
                select: "-applications -assignments -eligibility"
            });

        if(!user || !user.internships || !user.internships.currentInternship) {
            return res.status(404).json({ message: "No Internships Found" });
        }
        const currentInternship = user.internships.currentInternship;
        return res.status(200).json({
            currentInternship,
        });
    } catch (err) {
        console.log("error in ongoingInternship users");
        console.log(err);
        return res.status(500).json({ error: "Server Error" });
    }
}


async function appliedInternships(req, res) {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId).populate("internships.applications");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const appliedInternships = user.internships.applications;
        if (!appliedInternships || appliedInternships.length === 0) {
            return res.status(404).json({ message: "No Applications Found" });
        }

        return res.status(200).json({
            applications: appliedInternships,
        });
    } catch (err) {
        console.error("user applied internship error:", err);
        return res.status(500).json({ error: "Server Error" });
    }
}


async function internshipDetails(req, res) {
    try {
        const {internshipId} = req.params;

        const internship = await Internship.findById(internshipId)
            .select("-eligibility -assignments -applications")
            .populate("company", "name uniqueName description industry website location");

        if(!internship) {
            return res.status(404).json({message : "No Internship Found for this ID"})
        }
        return res.status(200).json({
            internship : internship,
        })
    } catch (err) {
        console.error(" user complete internship details error");
        console.log(err)
        return res.status(500).json({error: "Server Error"});
    }
}


module.exports = {
    ongoingInternship,
    appliedInternships,
    internshipDetails,
}