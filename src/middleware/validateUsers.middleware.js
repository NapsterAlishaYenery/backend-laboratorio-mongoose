// Middleware de Validación de Usuarios
const { Types } = require("mongoose");

// Campos permitidos en actualización
const CAMPOS_PERMITIDOS = [
    "nombre",
    "apellido",
    "telefono",
    "edad",
    "direccion"
];

const validarUsuarios = {
    // --- VALIDAR REGISTRO ---
    registro: (req, res, next) => {
        const { nombre, apellido, username, password, email } = req.body;

        if (!nombre || !apellido || !username || !password || !email) {
            return res.status(400).json({ 
                ok: false, 
                message: "Missing required fields (nombre, apellido, username, password, email)" 
            });
        }
        next();
    },

    // --- VALIDAR LOGIN ---
    login: (req, res, next) => {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                ok: false,
                message: "Username and password are required"
            });
        }

        next();
    },

    // --- VALIDAR ID ---
    id: (req, res, next) => {
        const { id } = req.params;

        if (!Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                ok: false,
                message: "Invalid ID format"
            });
        }

        next();
    },

    // --- VALIDAR UPDATE ---
    upDate: (req, res, next) => {
        const updates = req.body;
        const camposRecibidos = Object.keys(updates);

        const camposProhibidos = ["username", "email", "password", "password_hash", "_id", "createdAt", "updatedAt"];

        if (camposRecibidos.length === 0) {
            return res.status(400).json({
                ok: false, 
                message: "No fields provided for update"
             });
        }

        for (const campo of camposRecibidos) {
            if (camposProhibidos.includes(campo)) {
                return res.status(400).json({
                    ok: false,
                    message: `Field '${campo}' is protected and cannot be updated.`
                });
            }

        }

        next();
    }
}

module.exports = validarUsuarios;