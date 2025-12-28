// Importar modelo
const AddOns = require("../models/addons.model");


// Crear AddOns (único registro)
exports.createAddOns = async (req, res) => {

    const { weights, flavors, fillings } = req.body;

    try {

        // Verificar si ya existe un registro
        const existente = await AddOns.findOne();

        if (existente) {

            return res.status(400).json({
                ok: false,
                message: "AddOns configuration already exists",
                type: "DUPLICATE_CONFIG_ERROR"
            });
        }

        // Crear AddOns
        const nuevoAddOns = await AddOns.create({
            weights,
            flavors,
            fillings
        });

        res.status(201).json({
            ok: true,
            message: "AddOns configuration created successfully",
            data: nuevoAddOns
        });

    } catch (error) {
        if (error.name === 'ValidationError') {
            const firstError = Object.values(error.errors)[0].message;
            return res.status(400).json({ 
                ok: false, 
                message: firstError, 
                type: "VALIDATION_ERROR" });
        }
        res.status(500).json({ 
            ok: false, 
            message: "Internal server error", 
            type: "SERVER_ERROR" 
        });
    }
};

// Obtener AddOns (único registro)
exports.getAddOns = async (req, res) => {

    try {

        const addons = await AddOns.find();

        res.status(200).json({
            ok: true,
            message: "AddOns retrieved successfully",
            data: addons || {}
        });

    } catch (error) {
        res.status(500).json({ 
            ok: false, 
            message: "Internal server error", 
            type: "SERVER_ERROR" 
        });
    }
};

// Actualizar AddOns
exports.updateAddOns = async (req, res) => {

    const { action, target, data, match } = req.body;

    try {

        let updateQuery = {};
        let options = { new: true, runValidators: true };

        // AGREGAR NUEVO OBJETO
        if (action === "add") {
            updateQuery = {
                $push: {
                    [target]: data
                }
            };
        }

        // ACTUALIZAR OBJETO EXISTENTE
        if (action === "update") {
            updateQuery = {
                $set: {
                    [`${target}.$[elem]`]: {
                        ...data
                    }
                }
            };

            options.arrayFilters = [
                { "elem.value": match.value }
            ];
        }

        const actualizado = await AddOns.findOneAndUpdate(
            {},
            updateQuery,
            options
        );

        if (!actualizado) {
            return res.status(404).json({
                ok: false,
                message: "AddOns configuration not found",
                type: "NOT_FOUND"
            });
        }

        res.status(200).json({
            ok: true,
            message: `AddOn ${action}ed successfully in ${target}`,
            data: actualizado
        });

    } catch (error) {
        if (error.name === 'ValidationError') {
            const firstError = Object.values(error.errors)[0].message;
            return res.status(400).json({ 
                ok: false, 
                message: firstError, 
                type: "VALIDATION_ERROR" 
            });
        }
        res.status(500).json({ 
            ok: false, 
            message: "Internal server error", 
            type: "SERVER_ERROR" });
    }
};

// Eliminar AddOns
exports.deleteAddOns = async (req, res) => {

    try {

        const eliminado = await AddOns.findOneAndDelete();

        if (!eliminado) {
            return res.status(404).json({
                ok: false,
                message: "AddOns configuration not found",
                type: "NOT_FOUND"
            });
        }

        res.status(200).json({
            ok: true,
            message: "AddOns configuration deleted successfully",
            data: null
        });

    } catch (error) {
        res.status(500).json({ 
            ok: false, 
            message: "Internal server error", 
            type: "SERVER_ERROR" 
        });
    }
};

// Obtener solo un tipo de AddOns
exports.getAddOnByType = async (req, res) => {

    const { tipo } = req.query; // lee el query param 'tipo'
    const tiposPermitidos = ["weights", "fillings", "flavors"];

    if (!tipo || !tiposPermitidos.includes(tipo)) {
        return res.status(400).json({ 
            ok: false, 
            message: "Invalid AddOn type", 
            type: "INVALID_QUERY_PARAM" 
        });
    }

    try {

        const addons = await AddOns.findOne();
        if (!addons) {
            return res.status(404).json({ 
                ok: false, 
                message: "AddOns configuration not found", 
                type: "NOT_FOUND" 
            });
        }

        res.status(200).json({
            ok: true,
            message: `Options for ${tipo} retrieved successfully`,
            data: addons[tipo]
        });
    } catch (error) {
        res.status(500).json({ 
            ok: false,
            message: "Internal server error", 
            type: "SERVER_ERROR" 
        });
    }
};