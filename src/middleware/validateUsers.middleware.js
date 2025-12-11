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
        const { nombre, apellido, username, password, email, telefono, edad, direccion } = req.body;
        
        // Campos obligatorios
        if (!nombre || typeof nombre !== "string" || nombre.trim() === "") {
            return res.status(400).json({ error: "El nombre es obligatorio" });
        }

        if (!apellido || typeof apellido !== "string" || apellido.trim() === "") {
            return res.status(400).json({ error: "El apellido es obligatorio" });
        }

        if (!username || typeof username !== "string" || username.trim() === "") {
            return res.status(400).json({ error: "El username es obligatorio" });
        }

        if (!password || typeof password !== "string" || password.length < 8) {
            return res.status(400).json({
                error: "El password debe tener al menos 8 caracteres",
            });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            return res.status(400).json({ error: "El email no es válido" });
        }

        // Campos opcionales
        if (telefono && (typeof telefono !== "string" || telefono.length > 20)) {
            return res.status(400).json({ error: "El teléfono es inválido." });
        }

        if (edad && (typeof edad !== "number" || edad < 1 || edad > 120)) {
            return res.status(400).json({ error: "La edad debe ser un número válido entre 1 y 120." });
        }

        if (direccion) {
            if (typeof direccion !== "object" || direccion === null || Array.isArray(direccion)) {
                return res.status(400).json({ error: "Dirección debe ser un objeto válido." });
            }

            const subCamposRecibidos = Object.keys(direccion);

            for (const subCampo of subCamposRecibidos) {
                const valor = direccion[subCampo];
                if (typeof valor !== "string" || valor.trim() === "") {
                    return res.status(400).json({ error: `El campo '${subCampo}' dentro de la dirección es inválido o está vacío.` });
                }
            }
        }

        next();
    },

    // --- VALIDAR LOGIN ---
    login: (req, res, next) => {
        const { username, password } = req.body;

        if (!username || typeof username !== "string" || username.trim() === "") {
            return res.status(400).json({ error: "El username es obligatorio" });
        }

        if (!password || typeof password !== "string") {
            return res.status(400).json({ error: "El password es obligatorio" });
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

        const camposProhibidos = ["username", "email", "password", "password_hash", "_id", "creadoEn"];

        if (camposRecibidos.length === 0) {
            return res.status(400).json({ error: "No se proporcionaron campos para actualizar." });
        }

        for (const campo of camposRecibidos) {
            if (camposProhibidos.includes(campo)) {
                return res.status(400).json({
                    error: `No puedes actualizar el campo '${campo}'. Es un campo protegido.`
                });
            }

            if (!CAMPOS_PERMITIDOS.includes(campo)) {
                return res.status(400).json({
                    error: `El campo '${campo}' no es un campo de usuario válido para actualizar.`
                });
            }

             // Validaciones por campo
            if (campo === "nombre" && (typeof updates.nombre !== "string" || updates.nombre.trim() === "")) {
                return res.status(400).json({ error: "El nombre debe ser una cadena válida." });
            }
            if (campo === "apellido" && (typeof updates.apellido !== "string" || updates.apellido.trim() === "")) {
                return res.status(400).json({ error: "El apellido debe ser una cadena válida." });
            }
            if (campo === "edad" && (typeof updates.edad !== "number" || updates.edad < 1)) {
                return res.status(400).json({ error: "La edad debe ser un número válido." });
            }

            // Validar objeto dirección
            if (campo === "direccion") {
                const dir = updates.direccion;

                if (typeof dir !== "object" || dir === null || Array.isArray(dir)) {
                    return res.status(400).json({
                        error: "Dirección debe ser un objeto válido que contenga campos de dirección."
                    });
                }

                const subCamposPermitidos = ["calle", "ciudad", "municipio", "codigo_postal"];
                const subCamposRecibidos = Object.keys(dir);

                if (subCamposRecibidos.length === 0) {
                    return res.status(400).json({ error: "El objeto 'direccion' no puede estar vacío." });
                }

        
                for (const subCampo of subCamposRecibidos) {
                    const valor = dir[subCampo];

    
                    if (!subCamposPermitidos.includes(subCampo)) {
                        return res.status(400).json({
                            error: `El subcampo '${subCampo}' no es un campo permitido en la dirección.`
                        });
                    }

            
                    if (typeof valor !== "string" || valor.trim() === "") {
                        return res.status(400).json({
                            error: `El campo '${subCampo}' dentro de la dirección es inválido o está vacío.`
                        });
                    }

                     if (subCampo === "codigo_postal" && valor.length > 10) {
                        return res.status(400).json({
                            error: "El código postal es demasiado largo."
                        });
                    }
                }
            }
        }

        next();
    }
}

module.exports = validarUsuarios;