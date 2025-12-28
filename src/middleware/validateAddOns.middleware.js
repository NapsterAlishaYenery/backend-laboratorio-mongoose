// Middleware de Validación de AddOns
const validarAddOns = {

    // VALIDAR CREACIÓN DE AddOns
    registro: (req, res, next) => {
        const { weights, flavors, fillings } = req.body;

        if (!weights || !flavors || !fillings) {
            return res.status(400).json({ 
                ok: false, 
                message: "Missing required fields (weights, flavors, fillings)" ,
                type: "INVALID_BODY_STRUCTURE"
            });
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
            return res.status(400).json({ 
                ok: false, 
                message: "Valid action ('add' or 'update') is required",
                type: "INVALID_ACTION" 
            });
        }

        // --- Validar target ---
        if (!target || !targetsPermitidos.includes(target)) {
            return res.status(400).json({ 
                ok: false, 
                message: "Valid target ('weights', 'fillings' or 'flavors') is required",
                type: "INVALID_TARGET"
            });
        }

        // --- Validar data ---
        if (!data || typeof data !== "object") {
            return res.status(400).json({ 
                ok: false, 
                message: "Valid data object is required",
                type: "INVALID_DATA_FORMAT"
            });
        }


        // --- Validación específica para update ---
        if (action === "update" && (!match || !match.value)) {
          
            return res.status(400).json({ 
                ok: false, 
                message: "Field 'match.value' is required for update action",
                type: "MISSING_MATCH_CRITERIA"
            });
        
        }

        next();
    }
};

module.exports = validarAddOns;
