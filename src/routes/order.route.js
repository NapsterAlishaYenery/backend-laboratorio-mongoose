const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller");
const writeLimiter = require('../middleware/rateLimiter.middleware');
const validarOrden = require('../middleware/validarOrden');
const validarCaptura = require('../middleware/validar-captura.middleware');


// POST /api/orders
router.post("/", [writeLimiter, validarOrden], orderController.createOrder);

// Capturar el pago de PayPal (NUEVA RUTA)
// Esta se llama desde el frontend cuando el cliente termina de poner su tarjeta
router.post("/capture", [writeLimiter, validarCaptura], orderController.captureOrder);

// Obtener una orden por ID
router.get("/:id", orderController.getOrderById);

module.exports = router;