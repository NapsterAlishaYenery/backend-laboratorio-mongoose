// Middleware de Validación de AddOns
const validarAddOns = {

    // VALIDAR CREACIÓN DE AddOns
    registro: (req, res, next) => {
        const { weights, flavors, fillings } = req.body;

        // --- Validar que los arrays existan y no estén vacíos ---
        if (!Array.isArray(weights) || weights.length === 0) {
            return res.status(400).json({ error: "Debe existir al menos un peso en 'weights'" });
        }

        if (!Array.isArray(fillings) || fillings.length === 0) {
            return res.status(400).json({ error: "Debe existir al menos un relleno en 'fillings'" });
        }

        if (!Array.isArray(flavors) || flavors.length === 0) {
            return res.status(400).json({ error: "Debe existir al menos un sabor en 'flavors'" });
        }

        // --- Validar objetos dentro de weights ---
        for (const w of weights) {
            if (!w.value || typeof w.value !== "string" || w.value.trim() === "") {
                return res.status(400).json({ error: "Cada peso debe tener 'value' válido" });
            }
            if (!w.label || typeof w.label !== "string" || w.label.trim() === "") {
                return res.status(400).json({ error: "Cada peso debe tener 'label' válido" });
            }
            if (w.price === undefined || typeof w.price !== "number") {
                return res.status(400).json({ error: "Cada peso debe tener 'price' obligatorio" });
            }
        }

        // --- Validar objetos dentro de fillings ---
        for (const f of fillings) {
            if (!f.value || typeof f.value !== "string" || f.value.trim() === "") {
                return res.status(400).json({ error: "Cada relleno debe tener 'value' válido" });
            }
            if (!f.label || typeof f.label !== "string" || f.label.trim() === "") {
                return res.status(400).json({ error: "Cada relleno debe tener 'label' válido" });
            }
            if (f.price === undefined || typeof f.price !== "number") {
                return res.status(400).json({ error: "Cada relleno debe tener 'price' obligatorio" });
            }
        }

        // Validar objetos dentro de flavors
        for (const fl of flavors) {
            if (!fl.value || typeof fl.value !== "string" || fl.value.trim() === "") {
                return res.status(400).json({ error: "Cada sabor debe tener 'value' válido" });
            }
            if (!fl.label || typeof fl.label !== "string" || fl.label.trim() === "") {
                return res.status(400).json({ error: "Cada sabor debe tener 'label' válido" });
            }
            // flavors NO debe tener price
            if (fl.price !== undefined) {
                return res.status(400).json({ error: "'flavors' no debe tener campo 'price'" });
            }
        }

        next();
    },

    // VALIDAR UPDATE DE AddOns
    upDate: (req, res, next) => {
        const { action, target, data, match } = req.body;

        const targetsPermitidos = ["weights", "fillings", "flavors"];
        const accionesPermitidas = ["add", "update"];

        // --- Validar acción ---
        if (!action || !accionesPermitidas.includes(action)) {
            return res.status(400).json({ error: "Se debe especificar una acción válida ('add' o 'update')" });
        }

        // --- Validar target ---
        if (!target || !targetsPermitidos.includes(target)) {
            return res.status(400).json({ error: "Se debe especificar un target válido ('weights', 'fillings' o 'flavors')" });
        }

        // --- Validar data ---
        if (!data || typeof data !== "object") {
            return res.status(400).json({ error: "Se debe proporcionar un objeto 'data' válido" });
        }

        // --- Validar campos del objeto según target ---
        if (!data.value || typeof data.value !== "string" || data.value.trim() === "") {
            return res.status(400).json({ error: "'data.value' es obligatorio y debe ser cadena" });
        }

        if (!data.label || typeof data.label !== "string" || data.label.trim() === "") {
            return res.status(400).json({ error: "'data.label' es obligatorio y debe ser cadena" });
        }

        // price obligatorio para weights y fillings
        if ((target === "weights" || target === "fillings") && (data.price === undefined || typeof data.price !== "number")) {
            return res.status(400).json({ error: `'data.price' es obligatorio para '${target}' y debe ser número` });
        }

        // flavors NO debe tener price
        if (target === "flavors" && data.price !== undefined) {
            return res.status(400).json({ error: "'flavors' no debe tener campo 'price'" });
        }

        // --- Validación específica para update ---
        if (action === "update") {
            if (!match || typeof match !== "object" || !match.value) {
                return res.status(400).json({ error: "Se debe proporcionar 'match.value' para actualizar un objeto existente" });
            }
        }

        next();
    }
};

module.exports = validarAddOns;
