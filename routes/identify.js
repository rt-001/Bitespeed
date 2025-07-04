const express = require("express");
const router = express.Router();
const identifyUser = require("../controllers/contactController");

router.post("/", identifyUser);

module.exports = router;
