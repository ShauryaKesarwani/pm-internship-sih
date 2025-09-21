const express = require('express');
const { requireCompanyLogin } = require('../middleware/companyAuth');
const {
    loginCompany,
    getCompanyProfile,
    updateCompanyProfile,
    signUp
} = require('../controller/CompanyController');

const {
    createInternship,
    getPostedInternships,
    closeApplications,
    getApplicants,
    getApplicantProfile,
    updateInternshipDetails,
    deleteInternship,
    internshipDetails,
    acceptIntern
} = require('../controller/InternshipController');

const router = express.Router();

router.post("/login", loginCompany); //
router.post("/signup", signUp); //
router.get("/profile", requireCompanyLogin, getCompanyProfile); //
router.patch("/profile/update", requireCompanyLogin, updateCompanyProfile); //

router.post("/internship/create", requireCompanyLogin, createInternship); //
router.get("/internships", requireCompanyLogin, getPostedInternships); //
router.patch("/internship/:internshipId/close", requireCompanyLogin, closeApplications); //
router.get("/internship/:internshipId/applicants", requireCompanyLogin, getApplicants); //
router.get("/internship/applicant/:applicationId", requireCompanyLogin, getApplicantProfile); //nahi chal rha
router.patch("/internship/:internshipId", requireCompanyLogin, updateInternshipDetails); //
router.delete("/internship/:internshipId", requireCompanyLogin, deleteInternship); //
router.get("/internship/:internshipId", requireCompanyLogin, internshipDetails); //
router.post("/:internshipId/accept/:userId", requireCompanyLogin, acceptIntern); //

module.exports = router;