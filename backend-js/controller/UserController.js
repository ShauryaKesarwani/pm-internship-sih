const express = require('express')

const {
    profile,
    experience,
    companyProfile,
    getProjects
} = require('../controller/UserController');

const {
    ongoingInternship,
    appliedInternships,
    internshipDetails
} = require('../controller/UserInternshipController');

const router = express.Router();

router.get("/profile", profile);
router.get("/experience", experience);
router.get("/company/profile/:companyId", companyProfile);
router.get("/projects", getProjects);

router.get("/internship/ongoing", ongoingInternship);
router.get("/internship/applied", appliedInternships);
router.get("/internship/details/:internshipId", internshipDetails);

module.exports = router;