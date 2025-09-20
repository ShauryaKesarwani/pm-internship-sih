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
    getPastInternships,
    registerInternship } = require('../controller/UserInternshipController');

const router = express.Router();

router.get("/profile", isUserAuthenticated, profile); // --integrated
router.get("/experience", isUserAuthenticated, experience); // --integrated
router.get("/company/profile/:companyId", isUserAuthenticated, companyProfile); // --
router.get("/projects", isUserAuthenticated, getProjects); // ---
router.post("/project/add", isUserAuthenticated, addProject); //
router.patch("/profile/edit", isUserAuthenticated, editProfile); // --integrated
router.get("/resume/get", isUserAuthenticated, getResume); // --
router.get("/profile/resume", isUserAuthenticated, getProfileResume); // --integrated
router.post("/resume/upload", isUserAuthenticated, upload.single("resume"), uploadResume); //works


router.get("/internship/ongoing", isUserAuthenticated, ongoingInternship); // --integrated
router.get("/internship/applied",isUserAuthenticated, appliedInternships); // --integrated
router.get("/internship/details/:internshipId", internshipDetails); //
router.get("/internship/past",isUserAuthenticated, getPastInternships); // -- integrated
router.post("/internship/register",isUserAuthenticated, registerInternship); // --

router.post("/:id/quiz", isUserAuthenticated, saveQuiz)

module.exports = router;