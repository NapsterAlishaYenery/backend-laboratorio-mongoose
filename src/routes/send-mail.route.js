const express = require("express");
const router = express.Router();


const writeLimiter = require("../middleware/rateLimiter.middleware");
const emailController = require("../controllers/send-emial.controller");
const validarEmail = require('../middleware/send-email.middleware');

router.post("/send-email", writeLimiter, validarEmail.emailValidator, emailController.sendMail)

module.exports = router;