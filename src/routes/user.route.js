// Dependencias
const express = require("express");
const router = express.Router();

// Middlewares
const authMiddleware = require("../middleware/auth.middleware");
const writeLimiter = require("../middleware/rateLimiter.middleware");
const validarUsuarios = require('../middleware/validateUsers.middleware');

// Controlador
const usuariosController = require("../controllers/user.controller");



/**
 * @route GET /api/usuarios/
 * @desc Obtener todos los usuarios (solo campos públicos)
 * @access Público
 */
router.get("/", usuariosController.getAllUsers);

/**
 * @route GET /api/usuarios/perfil/:id
 * @desc Obtener perfil privado de un usuario
 * @access Privado (Requiere token)
 */
router.get("/perfil/:id", authMiddleware, validarUsuarios.id,  usuariosController.getPerfil);

/**
 * @route POST /api/usuarios/register
 * @desc Registrar usuario nuevo
 * @access Público
 */
router.post("/register", validarUsuarios.registro, writeLimiter, usuariosController.signUpUser);

/**
 * @route POST /api/usuarios/login
 * @desc Iniciar sesión
 * @access Público
 */
router.post("/login", validarUsuarios.login, writeLimiter, usuariosController.signInUser);

/**
 * @route PATCH /api/usuarios/:id
 * @desc Actualizar usuario
 * @access Privado (requiere token)
 */
router.patch("/:id", authMiddleware, validarUsuarios.id, validarUsuarios.upDate, writeLimiter,  usuariosController.UpDateUser);



module.exports = router;
