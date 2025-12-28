const { Schema, model } = require("mongoose");

const OrderSchema = new Schema({
    // Número de orden para la factura (ej: ORD-176666...)
    orderNumber: {
        type: String,
        required: [true, 'Order number is required'],
        unique: true,
        index: true // Esto hace que buscar por "ORD-..." sea rápido},
    },
    // Datos del cliente del formulario
    customer: {
        name: {
            type: String,
            required: [true, 'Customer name is required'], 
            trim: true
        },
        email: {
            type: String,
            required: [true, 'Customer email is required'], 
            trim: true
        },
        phone: {
            type: String,
            required: [true, 'Customer phone is required'], 
            trim: true
        },
        address: {
            type: String,
            trim: true
        }
    },

    // El Carrito (Soporta productos simples y personalizados)
    items: [{
        _id: false, // <--- ESTO EVITA EL ID EN CADA ITEM
        id: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
        price: {
            type: Number,
            required: true
        }, // Precio base
        total: {
            type: Number,
            required: true
        }, // total del item (cant * unitTotal)

        // El Breakdown es opcional (solo para pasteles/personalizados)
        breakdown: {
            _id: false, // <--- ÚTIL: Evita IDs en el objeto anidado
            basePrice: Number,
            weightPrice: Number,
            unitTotal: Number
        },

        // Detalles adicionales para la factura
        weight: {
            label: String,
            value: String
        },
        fillings: [{
            _id: false, // <--- CORRECTO: Muy importante aquí también
            label: String,
            value: String,
            totalPrice: Number
        }],
        flavors: [String]
    }],

    // Totales financieros
    summary: {
        subtotal: {
            type: Number,
            required: true
        },
        itbis: {
            type: Number,
            required: true
        },
        delivery: {
            type: Number,
            required: true
        },
        total: {
            type: Number,
            required: true
        }
    },

    // Logística y Pago
    deliveryType: {
        type: String,
        enum: ['local', 'delivery'],
        required: true
    },
    paymentMethod: {
        type: String,
        enum: ['tarjeta', 'paypal', 'pay-later'],
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending'
    },

    // ID que te dará PayPal cuando se cree la orden
    paypalOrderId: { type: String },
    
    // ✅ NUEVO: ID de la captura del pago (PayPal)
    paypalCaptureId: { type: String }

}, {
    timestamps: true,
    versionKey: false
});

module.exports = model("Order", OrderSchema);