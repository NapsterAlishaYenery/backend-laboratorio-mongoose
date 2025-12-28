const validarCaptura = (req, res, next) => {
    const { paypalOrderId, mongoOrderId } = req.body;

    if (!paypalOrderId || !mongoOrderId) {
        return res.status(400).json({ 
            ok: false, 
            msg: "Faltan datos necesarios para procesar el pago (IDs requeridos)." 
        });
    }

    // Validar que el mongoOrderId tenga el formato correcto de MongoDB (24 caracteres)
    if (mongoOrderId.length !== 24) {
        return res.status(400).json({ ok: false, msg: "ID de orden de base de datos inválido." });
    }

    next();
};

module.exports = validarCaptura;