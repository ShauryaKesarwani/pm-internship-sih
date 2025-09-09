const {isUserAuthenticated} = require('../middleware/UserAuth');

const express = require('express')

const {
    profile,
    experience,
    companyProfile,
    getProjects,
    editProfile,
    addProject
        } = require('../controller/UserController');

const {
    ongoingInternship,
    appliedInternships,
    internshipDetails } = require('../controller/UserInternshipController');

const router = express.Router();

router.get("/profile", isUserAuthenticated, profile); //
router.get("/experience", isUserAuthenticated, experience); //
router.get("/company/profile/:companyId", isUserAuthenticated, companyProfile); //
router.get("/projects", isUserAuthenticated, getProjects); //
router.post("/project/add", isUserAuthenticated, addProject); //
router.post("/profile/edit", isUserAuthenticated, editProfile); //


router.get("/internship/ongoing", isUserAuthenticated, ongoingInternship); //
router.get("/internship/applied",isUserAuthenticated, appliedInternships); //
router.get("/internship/details/:internshipId", isUserAuthenticated, internshipDetails); //


module.exports = router;
