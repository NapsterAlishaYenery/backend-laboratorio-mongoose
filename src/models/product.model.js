const { Schema, model } = require("mongoose");

const ProductoSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true // unico para no tener 2 productos con el mismo nombre
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    fullDescription: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    customizable: {
        type: Boolean,
        default: false
    },
    ingredients: {
        type: [String],
        default: []
    },
    allergens: {
        type: [String],
        default: []
    }
}, { versionKey: false });

module.exports = model("Producto", ProductoSchema);
