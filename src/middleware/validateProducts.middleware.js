// Middleware de Validación de Productos
const { Types } = require("mongoose");

// Campos permitidos en actualización
const CAMPOS_PERMITIDOS = [
    "name",
    "description",
    "fullDescription",
    "price",
    "image",
    "category",
    "customizable",
    "ingredients",
    "allergens"
];

const validarProductos = {

    // --- VALIDAR REGISTRO / CREACIÓN ---
    registro: (req, res, next) => {
        const {
            name,
            description,
            fullDescription,
            price,
            image,
            category,
        } = req.body;

        // Solo validamos presencia básica. Mongoose validará tipos y contenido.
        if (!name || !description || !fullDescription || !price || !image || !category) {
            return res.status(400).json({
                ok: false,
                message: "Missing required product fields",
                type: "INVALID_BODY_STRUCTURE"
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
                message: "Invalid product ID format",
                type: "INVALID_ID"
            });
        }

        next();
    },

    // --- VALIDAR UPDATE ---
    upDate: (req, res, next) => {
        const updates = req.body;
        const camposRecibidos = Object.keys(updates);

        const camposProhibidos = ["_id", "date", "createdAt", "updatedAt"];

        if (camposRecibidos.length === 0) {
            return res.status(400).json({
                ok: false,
                message: "No fields provided for update",
                type: "EMPTY_UPDATE"
            });
        }

        for (const campo of camposRecibidos) {

            // Bloquear campos protegidos
            if (camposProhibidos.includes(campo)) {
                return res.status(400).json({
                    ok: false,
                    message: `Field '${campo}' is protected and cannot be updated`,
                    type: "PROTECTED_FIELD"
                });
            }

            // Bloquear campos inexistentes
            if (!CAMPOS_PERMITIDOS.includes(campo)) {
                return res.status(400).json({
                    ok: false,
                    message: `Field '${campo}' is not a valid product property`,
                    type: "INVALID_FIELD"
                });
            }
        }

        next();
    }
}

module.exports = validarProductos;
