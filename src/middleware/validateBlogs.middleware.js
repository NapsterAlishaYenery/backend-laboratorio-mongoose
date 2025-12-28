// Middleware de Validación de Blogs
const { Types } = require("mongoose");

// Campos permitidos en actualización
const CAMPOS_PERMITIDOS = [
    "title",
    "excerpt",
    "content",
    "image",
    "category",
    "tags"
];

const validarBlogs = {

    // --- VALIDAR REGISTRO / CREACIÓN ---
    registro: (req, res, next) => {
        const {
            title,
            excerpt,
            content,
            image,
            author,
            category,
            tags
        } = req.body;

        // Filtro estructural básico
        if (!title || !excerpt || !content || !image || !author || !category) {
            return res.status(400).json({
                ok: false,
                message: "Missing required blog fields (title, excerpt, content, image, author, category)",
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
                message: "Invalid blog ID format",
                type: "INVALID_ID"
            });
        }

        next();
    },

    // --- VALIDAR UPDATE ---
    upDate: (req, res, next) => {
        const updates = req.body;
        const camposRecibidos = Object.keys(updates);

        const camposProhibidos = ["_id", "date", "createdAt", "updatedAt", "author"];

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
                    message: `Field '${campo}' is not a valid blog property`,
                    type: "INVALID_FIELD"
                });
            }
        }

        next();
    }
};

module.exports = validarBlogs;
