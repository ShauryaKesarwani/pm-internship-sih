const User = require("../Model/User");
const Internship = require("../Model/Internship");
const Company = require("../Model/Company");
const Application = require("../Model/Application");
var i = 1;

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
        const company = await Company.findOne(currentInternship.company);

        return res.status(200).json({
            currentInternship : {
                currentInternship,
                company
            }
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

        // Populate applications → internship → company
        const user = await User.findById(userId).populate({
            path: "internships.applications",
            populate: {
                path: "internship",
                model: "Internship",
                select: "internshipDetails company duration location stipend",
                populate: {
                    path: "company",
                    model: "Company",
                    select: "name"
                }
            }
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const appliedInternships = user.internships.applications
            .filter(app => app.internship)
            .map(app => ({
                _id: app._id,
                applicationStatus: app.status,
                internship: {
                    _id: app.internship._id,
                    title: app.internship?.internshipDetails?.title ?? "N/A",
                    company: app.internship?.company?.name ?? "Unknown",
                    duration: app.internship?.internshipDetails?.duration ?? "N/A",
                    location: app.internship?.internshipDetails?.location ?? "N/A",
                    stipend: app.internship?.internshipDetails?.stipend ?? "N/A"
                },
                documents: app.documents,
                appliedAt: app.appliedAt
            }));


        if (!appliedInternships || appliedInternships.length === 0) {
            return res.status(404).json({ message: "No Applications Found" });
        }

        // console.log(appliedInternships)
        return res.status(200).json({
            appliedInternships,
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
            .populate("company", "name industry website location");

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


async function saveQuiz(req, res){
    try{
        const {id} = req.params
        const {quiz, finalScore, finalDifficultyLevel} = req.body
        const application = await Application.findById(id);
        if (!application) return res.status(404).json({ error: "Application not found" });

        application.quiz = quiz;  // merge quiz history
        application.finalScore = finalScore ?? 0;
        application.finalDifficultyLevel = finalDifficultyLevel ?? null;
        application.updatedAt = new Date();
        await application.save();

        res.json({ message: "Quiz saved", application });
    }
    catch{
        console.error("Error saving quiz :", err);
        res.status(500).json({ error: err.message });
    }
}


async function getPastInternships(req, res) {
    try {
        const user = req.user;
        if (!user) {
            return res.status(404).json({ message: "Unauthorized" });
        }

        const freshUser = await User.findById(user._id).populate(
            "internships.pastInternships"
        );

        const pastInternships = freshUser.internships.pastInternships;

        if (!pastInternships || pastInternships.length === 0) {
            return res.status(404).json({ message: "No Past Internships Found" });
        }

        // Only send internshipDetails
        const internshipDetails = pastInternships.map(i => i.internshipDetails);

        return res.json({
            success: true,
            internships: internshipDetails,
        });
    } catch (err) {
        console.error("Error fetching past internships:", err);
        return res.status(500).json({ error: "Server Error" });
    }
}


async function registerInternship(req, res) {
    try {
        console.log(1);
        const {internshipId} = req.params;
        const userId = req.user._id;

        if (!userId || !internshipId) {
            return res.status(400).json({ error: "Missing userId or internshipId" });
        }
        console.log(userId)
        console.log(internshipId)

        console.log(-4);

        const user = await User.findById(userId);
        const internship = await Internship.findById(internshipId);

        if (!user || !internship) {
            return res.status(404).json({ error: "User or Internship not found" });
        }
        console.log(-3);

        // Check if user already has a placeholder application
        let application = await Application.findOne({ applicant: userId, internship: internshipId });
        if (application) {
            return res.status(409).json({ error: "User already registered for this internship" });
        }
        console.log(-2);

        application = await Application.create({
            applicant: user._id,
            internship: internship._id,
            status: "Registered",
            quiz: [],
        });
        console.log(-1);

        user.internships.applications.push(application._id);
        await user.save();

        internship.applications.push(application._id);
        await internship.save();
        console.log(2);
        console.log(application);

        return res.status(200).json({ message: "Registered successfully", application });
    } catch (err) {
        console.error("Error registering for internship:", err);
        return res.status(500).json({ error: "Server Error" });
    }
}
//update the status to submitted when quiz is submitted


async function sampleQuestions(req, res) {
    try {
        console.log(0);

        const {internshipId} = req.params;

        if (!internshipId) {
            return res.status(404).json({ message: "No Valid Internship Id" });
        }

        const internship = await Internship.findById(internshipId)
            .populate("sampleQuestions");
        console.log(1);

        if (!internship) {
            return res.status(404).json({ message: "No Internship Found" });
        }
        const sq = internship?.sampleQuestions;
        console.log(2);


        if (!sq) {
            return res.status(404).json({ message: "No Internship Found" });
        }
        return res.status(200).json(
            {sq}
        )

    } catch (err) {
        console.error("Error fetching sample internship Questions:", err);
        return res.status(500).json({ error: "Server Error" });
    }
}


module.exports = {
    ongoingInternship,
    appliedInternships,
    internshipDetails,
    saveQuiz,
    getPastInternships,
    registerInternship,
    sampleQuestions
}