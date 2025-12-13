const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth.middleware");
const writeLimiter = require("../middleware/rateLimiter.middleware");
const validarAddOns = require("../middleware/validateAddOns.middleware");
const controller = require("../controllers/addons.controller");

// RUTAS PÚBLICAS
router.get("/", controller.getAddOns);
router.get("/tipo", controller.getAddOnByType); // Obtener solo un tipo de AddOns

// RUTAS PRIVADAS
router.post("/", auth, writeLimiter, validarAddOns.registro, controller.createAddOns);
router.patch("/", auth, writeLimiter, validarAddOns.upDate, controller.updateAddOns);
router.delete("/", auth, writeLimiter, controller.deleteAddOns);

module.exports = router;
