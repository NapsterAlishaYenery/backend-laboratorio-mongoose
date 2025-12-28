const validarOrden = (req, res, next) => {
    const { name, email, phone, items, subtotal, itbis, delivery, entrega, metodo_pago } = req.body;

    // --- 1. VALIDACIÓN DE FORMATO (Tu código original) ---
    if (!name || name.trim().length < 3) {
        return res.status(400).json({ ok: false, msg: "El nombre es obligatorio (mínimo 3 caracteres)" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        return res.status(400).json({ ok: false, msg: "El correo electrónico no es válido" });
    }

    if (!phone || phone.trim().length < 10) {
        return res.status(400).json({ ok: false, msg: "El teléfono debe tener al menos 10 dígitos" });
    }

    if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ ok: false, msg: "El carrito no puede estar vacío" });
    }

    // --- 2. VALIDACIÓN DE INTEGRIDAD FINANCIERA (Recálculo en Servidor) ---
    try {
        // Recalcular Subtotal sumando el 'total' de cada item
        const subtotalCalculado = items.reduce((acc, item) => acc + (Number(item.total) || 0), 0);

        // Validar Delivery
        const deliveryCalculado = entrega === 'delivery' ? 150 : 0;

        // Calcular ITBIS (18%)
        const itbisCalculado = Number((subtotalCalculado * 0.18).toFixed(2));

        // Calcular Total Final
        const totalCalculado = Number((subtotalCalculado + itbisCalculado + deliveryCalculado).toFixed(2));

        // Comparar con lo que envió el Frontend
        const totalFront = Number(Number(subtotal) + Number(itbis) + Number(delivery)).toFixed(2);

        // Si la diferencia es mayor a 0.05 (por redondeos), bloqueamos
        if (Math.abs(totalCalculado - totalFront) > 0.05) {
            console.error(`🚨 Intento de fraude o error de cálculo. Front: ${totalFront}, Back: ${totalCalculado}`);
            return res.status(400).json({
                ok: false,
                msg: "Los totales no coinciden. Por favor, actualice su carrito."
            });
        }

        // Si todo está bien, pasamos al controlador
        next();

    } catch (error) {
        return res.status(500).json({ ok: false, msg: "Error al procesar los cálculos de la orden" });
    }
};

module.exports = validarOrden;