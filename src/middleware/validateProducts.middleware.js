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
            customizable,
            ingredients,
            allergens
        } = req.body;

        // Campos obligatorios
        if (!name || typeof name !== "string" || name.trim() === "") {
            return res.status(400).json({ error: "El nombre del producto es obligatorio" });
        }

        if (!description || typeof description !== "string" || description.trim() === "") {
            return res.status(400).json({ error: "La descripción es obligatoria" });
        }

        if (!fullDescription || typeof fullDescription !== "string" || fullDescription.trim() === "") {
            return res.status(400).json({ error: "La descripción completa es obligatoria" });
        }

        if (price === undefined || typeof price !== "number" || price <= 0 || price >= 1000000) {
            return res.status(400).json({ error: "El precio debe ser un número mayor que 0" });
        }

        if (!image || typeof image !== "string" || image.trim() === "") {
            return res.status(400).json({ error: "La imagen es obligatoria" });
        }

        if (!category || typeof category !== "string" || category.trim() === "") {
            return res.status(400).json({ error: "La categoría es obligatoria" });
        }

        // Validaciones opcionales
        if (customizable !== undefined && typeof customizable !== "boolean") {
            return res.status(400).json({ error: "El campo 'customizable' debe ser booleano" });
        }

        if (ingredients !== undefined) {
            if (!Array.isArray(ingredients)) {
                return res.status(400).json({ error: "El campo 'ingredients' debe ser un array de strings" });
            }

            for (const ing of ingredients) {
                if (typeof ing !== "string" || ing.trim() === "") {
                    return res.status(400).json({ error: "Todos los ingredientes deben ser cadenas válidas" });
                }
            }
        }

        if (allergens !== undefined) {
            if (!Array.isArray(allergens)) {
                return res.status(400).json({ error: "El campo 'allergens' debe ser un array de strings" });
            }

            for (const al of allergens) {
                if (typeof al !== "string" || al.trim() === "") {
                    return res.status(400).json({ error: "Todos los alérgenos deben ser cadenas válidas" });
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

        const camposProhibidos = ["_id", "date", "createdAt", "updatedAt"];

        if (camposRecibidos.length === 0) {
            return res.status(400).json({ error: "No se proporcionaron campos para actualizar." });
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
            if (campo === "name" && (typeof updates.name !== "string" || updates.name.trim() === "")) {
                return res.status(400).json({ error: "El nombre debe ser una cadena válida." });
            }

            if (campo === "description" && (typeof updates.description !== "string" || updates.description.trim() === "")) {
                return res.status(400).json({ error: "La descripción debe ser una cadena válida." });
            }

            if (campo === "fullDescription" && (typeof updates.fullDescription !== "string" || updates.fullDescription.trim() === "")) {
                return res.status(400).json({ error: "La descripción completa debe ser una cadena válida." });
            }

            if (campo === "price" && (typeof updates.price !== "number" || updates.price <= 0 || updates.price >= 1000000)) {
                return res.status(400).json({ error: "El precio debe ser un número válido mayor que 0." });
            }

            if (campo === "image" && (typeof updates.image !== "string" || updates.image.trim() === "")) {
                return res.status(400).json({ error: "La imagen debe ser una cadena válida." });
            }

            if (campo === "category" && (typeof updates.category !== "string" || updates.category.trim() === "")) {
                return res.status(400).json({ error: "La categoría debe ser una cadena válida." });
            }

            if (campo === "customizable" && typeof updates.customizable !== "boolean") {
                return res.status(400).json({ error: "El campo 'customizable' debe ser booleano." });
            }

            if (campo === "ingredients") {

                if (!Array.isArray(updates.ingredients)) {
                    return res.status(400).json({ error: "'ingredients' debe ser un array de strings." });
                }

                for (const ing of updates.ingredients) {
                    if (typeof ing !== "string" || ing.trim() === "") {
                        return res.status(400).json({
                            error: "Todos los ingredientes deben ser cadenas válidas."
                        });
                    }
                }
            }

            if (campo === "allergens") {

                if (!Array.isArray(updates.allergens)) {
                    return res.status(400).json({ error: "'allergens' debe ser un array de strings." });
                }

                for (const al of updates.allergens) {
                    if (typeof al !== "string" || al.trim() === "") {
                        return res.status(400).json({
                            error: "Todos los alérgenos deben ser cadenas válidas."
                        });
                    }
                }
            }
        }

        next();
    }
}

module.exports = validarProductos;
