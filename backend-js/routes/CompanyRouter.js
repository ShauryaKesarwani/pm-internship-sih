const express = require('express')
const {requireCompanyLogin} = require('../middleware/companyAuth')
const { loginCompany,
    getCompanyProfile, updateCompanyProfile } = require('../controller/CompanyController');

const router = express.Router();

router.post("/login", requireCompanyLogin, loginCompany);
router.get("/profile", requireCompanyLogin, getCompanyProfile);
router.get("/updateProfile", requireCompanyLogin, updateCompanyProfile);

module.exports = router;