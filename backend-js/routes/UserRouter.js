const {isUserAuthenticated} = require('../middleware/UserAuth');

const express = require('express')

const {
    profile,
    experience,
    companyProfile,
    getProjects,
    editProfile } = require('../controller/UserController');

const {
    ongoingInternship,
    appliedInternships,
    internshipDetails } = require('../controller/UserInternshipController');

const router = express.Router();

router.get("/profile", isUserAuthenticated, profile);
router.get("/experience", isUserAuthenticated, experience);
router.get("/company/profile", isUserAuthenticated, companyProfile);
router.get("/projects", isUserAuthenticated, getProjects);
router.post("/profile/edit", isUserAuthenticated, editProfile);


router.get("/internship/ongoing", isUserAuthenticated, ongoingInternship);
router.get("/internship/applied",isUserAuthenticated, appliedInternships);
router.get("/internship/details", isUserAuthenticated, internshipDetails);


module.exports = router;
