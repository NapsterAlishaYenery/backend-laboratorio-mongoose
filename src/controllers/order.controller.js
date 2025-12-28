const Order = require("../models/order.model");
const { enviarEmail } = require("../services/mail.service");
const { buildInvoiceTemplate } = require("../templates/invoice.template");

// IMPORTAMOS EL SERVICIO DE PAYPAL (Asegúrate de haber creado el archivo anterior)
const { createPayPalOrder, capturePayPalOrder } = require("../services/paypal.service");

// =====================================================
// Generar número de orden único
// =====================================================
const generarNumeroOrden = () => {
    return `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
};

/**
 * =====================================================
 * CREAR ORDEN (SOLO PENDIENTE)
 * =====================================================
 * ❗ NO envía correos
 * ❗ NO confirma pago
 * ✔ Solo crea orden + PayPal Order
 */
exports.createOrder = async (req, res) => {
    try {
        // Recibimos los datos tal cual los armaste en el payload de Angular
        const {
            name,
            email,
            phone,
            items,
            subtotal,
            itbis,
            delivery,
            entrega,
            metodo_pago,
            direccion
        } = req.body;

        // 1. Mapeamos los items para que coincidan con el Schema
        // Aseguramos que los productos simples también tengan una estructura limpia
        const formattedItems = items.map(item => ({
            id: item.id,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            total: item.total,
            // Guardamos el breakdown solo si existe (para pasteles personalizados)
            breakdown: item.breakdown ? {
                basePrice: item.breakdown.basePrice,
                weightPrice: item.breakdown.weightPrice,
                unitTotal: item.breakdown.unitTotal
            } : null,
            weight: item.weight || null,
            fillings: item.fillings || [],
            flavors: item.flavors || []
        }));

        // 2️⃣ Crear orden PENDIENTE
        const nuevaOrden = new Order({
            orderNumber: generarNumeroOrden(),
            customer: {
                name,
                email,
                phone,
                address: direccion || 'Recogida en local'
            },
            items: formattedItems,
            summary: {
                subtotal,
                itbis,
                delivery: delivery,
                total: Number((subtotal + itbis + delivery).toFixed(2))
            },
            deliveryType: entrega,
            paymentMethod: metodo_pago,
            paymentStatus: 'pending' // 🔴 SIEMPRE pendiente aquí
        });

        // --- LÓGICA DE PAYPAL ---
        let paypalOrderId = null;

        if (metodo_pago === 'paypal' || metodo_pago === "tarjeta") {
            const paypalOrder = await createPayPalOrder(
                nuevaOrden.summary.total
            );

            paypalOrderId = paypalOrder.id;
            nuevaOrden.paypalOrderId = paypalOrderId;
        }

        // 3. Guardamos en la base de datos
        const ordenGuardada = await nuevaOrden.save();

        // Si no es PayPal, enviamos la factura de una vez porque no hay "capture" automático
        if (metodo_pago === 'pay-later') {
            try {
                await enviarEmail({
                    to: ordenGuardada.customer.email,
                    bcc: process.env.CONTACT_EMAIL_RECEIVER,
                    subject: `Pedido Recibido #${ordenGuardada.orderNumber}`,
                    html: buildInvoiceTemplate(ordenGuardada)
                });
                console.log(`📧 Factura pay-later enviada: ${ordenGuardada.orderNumber}`);
            } catch (mailError) {
                console.error("❌ Error enviando correo pay-later:", mailError);
            }
        }

        // 5. Respuesta al Frontend
        // ✅ RESPUESTA LIMPIA AL FRONT
        return res.status(201).json({
            ok: true,
            message: 'Orden creada correctamente', // Antes era msg
            data: {                                // ⚠️ AGREGAMOS 'data'
                orderId: ordenGuardada._id,
                paypalOrderId: paypalOrderId
            }
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
        console.error("🔥 Error al crear orden:", error);
        res.status(500).json({
            ok: false,
            message: "Could not process order",
            type: "SERVER_ERROR"
        });

    }
};

// =====================================================
// OBTENER ORDEN POR ID
// =====================================================
exports.getOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await Order.findById(id);

        if (!order) {
            return res.status(404).json({
                ok: false,
                message: "Order not found",
                type: "NOT_FOUND"
            });
        }

        return res.status(200).json({
            ok: true,
            message: "Order retrieved successfully",
            data: order
        });

    } catch (error) {
        return res.status(500).json({
            ok: false,
            message: "Error retrieving order",
            type: "SERVER_ERROR"
        });
    }
};


/**
 * =====================================================
 * CAPTURAR PAGO (AQUÍ PASA TODO)
 * =====================================================
 * ✔ Captura PayPal
 * ✔ Confirma orden
 * ✔ Envía factura
 */
exports.captureOrder = async (req, res) => {
    try {
        const { paypalOrderId, mongoOrderId } = req.body;

        /**
        * =====================================================
        * ✅ MEJORA 1: Validar que la orden exista en Mongo
        * =====================================================
        */
        const ordenExistente = await Order.findById(mongoOrderId);

        if (!ordenExistente) {
            return res.status(404).json({
                ok: false,
                message: "Order not found in database",
                type: "NOT_FOUND"
            });
        }


        /**
         * =====================================================
         * CAPTURAR PAGO EN PAYPAL
         * =====================================================
         */
        const capture = await capturePayPalOrder(paypalOrderId);

        if (capture.status !== "COMPLETED") {
            return res.status(400).json({
                ok: false,
                message: "Payment was not completed in PayPal",
                type: "PAYMENT_INCOMPLETE"
            });
        }

        // 2️⃣ Actualizar orden en DB
        const orden = await Order.findByIdAndUpdate(
            mongoOrderId,
            {
                paymentStatus: 'completed',
                paypalCaptureId: capture.purchase_units?.[0]?.payments?.captures?.[0]?.id || capture.id // 👈 guardamos referencia del pago
            },
            { new: true }
        );

        if (!orden) {
            return res.status(404).json({
                ok: false,
                message: "Order not found during final update",
                type: "ORDER_NOT_FOUND_AT_CAPTURE"
            });
        }


        // Enviar factura
        try {
            await enviarEmail({
                to: orden.customer.email,
                bcc: process.env.CONTACT_EMAIL_RECEIVER,
                subject: `Factura de tu pedido #${orden.orderNumber}`,
                html: buildInvoiceTemplate(orden)
            });
            console.log(`📧 Factura enviada: ${orden.orderNumber}`);
        } catch (mailError) {
            console.error("❌ Error enviando factura:", mailError);
        }

        return res.status(200).json({
            ok: true,
            message: "Payment confirmed and invoice sent",
            data: orden
        });

    } catch (error) {
        console.error("🔥 Error capturando pago:", error);
        res.status(500).json({
            ok: false,
            message: "Internal error during payment capture",
            type: "CAPTURE_ERROR"
        });
    }
};