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
                error: "Ya existe una configuración de AddOns"
            });
        }

        // Crear AddOns
        const nuevoAddOns = await AddOns.create({
            weights,
            flavors,
            fillings
        });

        res.status(201).json({
            data: nuevoAddOns,
            message: "AddOns creados correctamente"
        });

    } catch (error) {

        res.status(500).json({
            error: "Error al crear AddOns"
        });
    }
};

// Obtener AddOns (único registro)
exports.getAddOns = async (req, res) => {

    try {

        const addons = await AddOns.find();

        res.status(200).json({
            data: addons,
            message: "AddOns obtenidos correctamente"
        });

    } catch (error) {

        res.status(500).json({
            error: "Error al obtener AddOns"
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
                error: "No existe configuración de AddOns"
            });
        }

        res.status(200).json({
            data: actualizado,
            message: "AddOns actualizados correctamente"
        });

    } catch (error) {

        res.status(500).json({
            error: "Error al actualizar AddOns"
        });
    }
};

// Eliminar AddOns
exports.deleteAddOns = async (req, res) => {

    try {

        const eliminado = await AddOns.findOneAndDelete();

        if (!eliminado) {
            return res.status(404).json({
                error: "No existe configuración de AddOns"
            });
        }

        res.status(200).json({
            message: "AddOns eliminados correctamente"
        });

    } catch (error) {

        res.status(500).json({
            error: "Error al eliminar AddOns"
        });
    }
};

// Obtener solo un tipo de AddOns
exports.getAddOnByType = async (req, res) => {

    const { tipo } = req.query; // lee el query param 'tipo'

    const tiposPermitidos = ["weights", "fillings", "flavors"];
    if (!tipo || !tiposPermitidos.includes(tipo)) {
        return res.status(400).json({ error: "Tipo de AddOn inválido" });
    }

    try {

        const addons = await AddOns.findOne();
        if (!addons) {
            return res.status(404).json({ error: "No existe configuración de AddOns" });
        }

        res.status(200).json({
            data: addons[tipo],
            message: `Opciones de ${tipo} obtenidas correctamente`
        });
    } catch (error) {

        res.status(500).json({ error: "Error al obtener las opciones de AddOns" });
    }
};