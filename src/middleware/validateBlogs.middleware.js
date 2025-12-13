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

        // Campos obligatorios
        if (!title || typeof title !== "string" || title.trim() === "") {
            return res.status(400).json({ error: "El título es obligatorio" });
        }

        if (!excerpt || typeof excerpt !== "string" || excerpt.trim() === "") {
            return res.status(400).json({ error: "El extracto es obligatorio" });
        }

        if (!content || typeof content !== "string" || content.trim() === "") {
            return res.status(400).json({ error: "El contenido es obligatorio" });
        }

        if (!image || typeof image !== "string" || image.trim() === "") {
            return res.status(400).json({ error: "La imagen es obligatoria" });
        }

        if (!author || typeof author !== "string" || author.trim() === "") {
            return res.status(400).json({ error: "El autor es obligatorio" });
        }

        if (!category || typeof category !== "string" || category.trim() === "") {
            return res.status(400).json({ error: "La categoría es obligatoria" });
        }

        // Campo opcional: tags
        if (tags !== undefined) {
            if (!Array.isArray(tags)) {
                return res.status(400).json({ error: "El campo 'tags' debe ser un array de strings" });
            }

            for (const tag of tags) {
                if (typeof tag !== "string" || tag.trim() === "") {
                    return res.status(400).json({
                        error: "Todos los tags deben ser cadenas válidas"
                    });
                }
            }
        }

        next();
    },

    // --- VALIDAR ID ---
    id: (req, res, next) => {
        const { id } = req.params;

        if (!Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "ID inválido" });
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
                error: "No se proporcionaron campos para actualizar."
            });
        }

        for (const campo of camposRecibidos) {

            // Bloquear campos protegidos
            if (camposProhibidos.includes(campo)) {
                return res.status(400).json({
                    error: `No puedes actualizar el campo '${campo}'. Es un campo protegido.`
                });
            }

            // Bloquear campos inexistentes
            if (!CAMPOS_PERMITIDOS.includes(campo)) {
                return res.status(400).json({
                    error: `El campo '${campo}' no es válido para actualizar.`
                });
            }

            // --- Validaciones por campo ---
            if (campo === "title" && (typeof updates.title !== "string" || updates.title.trim() === "")) {
                return res.status(400).json({ error: "El título debe ser una cadena válida." });
            }

            if (campo === "excerpt" && (typeof updates.excerpt !== "string" || updates.excerpt.trim() === "")) {
                return res.status(400).json({ error: "El extracto debe ser una cadena válida." });
            }

            if (campo === "content" && (typeof updates.content !== "string" || updates.content.trim() === "")) {
                return res.status(400).json({ error: "El contenido debe ser una cadena válida." });
            }

            if (campo === "image" && (typeof updates.image !== "string" || updates.image.trim() === "")) {
                return res.status(400).json({ error: "La imagen debe ser una cadena válida." });
            }

            if (campo === "category" && (typeof updates.category !== "string" || updates.category.trim() === "")) {
                return res.status(400).json({ error: "La categoría debe ser una cadena válida." });
            }

            if (campo === "tags") {

                if (!Array.isArray(updates.tags)) {
                    return res.status(400).json({
                        error: "El campo 'tags' debe ser un array de strings."
                    });
                }

                for (const tag of updates.tags) {
                    if (typeof tag !== "string" || tag.trim() === "") {
                        return res.status(400).json({
                            error: "Todos los tags deben ser cadenas válidas."
                        });
                    }
                }
            }
        }

        next();
    }
};

module.exports = validarBlogs;
