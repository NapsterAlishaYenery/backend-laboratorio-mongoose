const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth.middleware");
const validate = require("../middleware/validateProducts.middleware");
const writeLimiter = require("../middleware/rateLimiter.middleware");

const controller = require("../controllers/product.controller");

// PUBLICO
router.get("/destacados", controller.getProductosDestacados);
router.get("/categoria", controller.getProductosByCategory);
router.get("/", controller.getProductos);
router.get("/:id", validate.id, controller.getProductoById);


// PRIVADO
router.post("/", auth, writeLimiter, validate.registro, controller.createProducto);
router.patch("/:id", auth, writeLimiter, validate.id, validate.upDate ,controller.updateProducto);
router.delete("/:id", auth, writeLimiter, validate.id, controller.deleteProducto);

module.exports = router;
