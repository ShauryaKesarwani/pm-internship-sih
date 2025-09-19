const {isUserAuthenticated} = require('../middleware/UserAuth');
const upload = require("../config/multerConfig");

const express = require('express')

const { uploadResume, getResume } = require('../controller/ResumeController')


const {
    profile,
    experience,
    companyProfile,
    getProjects,
    editProfile,
    addProject,
    getProfileResume
        } = require('../controller/UserController');

const {
    ongoingInternship,
    appliedInternships,
    internshipDetails,
    saveQuiz,
    getPastInternships } = require('../controller/UserInternshipController');

const router = express.Router();

router.get("/profile", isUserAuthenticated, profile); // --//everything except, resume.experience.intenrships
router.get("/experience", isUserAuthenticated, experience); // --
router.get("/company/profile/:companyId", isUserAuthenticated, companyProfile); //
router.get("/projects", isUserAuthenticated, getProjects); // ---
router.post("/project/add", isUserAuthenticated, addProject); //
router.patch("/profile/edit", isUserAuthenticated, editProfile); //
router.get("/resume/get", isUserAuthenticated, getResume);
router.get("/profile/resume", isUserAuthenticated, getProfileResume); //
router.post("/resume/upload", isUserAuthenticated, upload.single("resume"), uploadResume); //works


router.get("/internship/ongoing", isUserAuthenticated, ongoingInternship); // --
router.get("/internship/applied",isUserAuthenticated, appliedInternships); // --
router.get("/internship/details/:internshipId", isUserAuthenticated, internshipDetails); //
router.get("/internship/past",isUserAuthenticated, getPastInternships); // -- prolly ?

router.post("/:id/quiz", isUserAuthenticated, saveQuiz)

module.exports = router;