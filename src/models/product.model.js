const { Schema, model } = require("mongoose");

const ProductoSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true,
        unique: true, // unico para no tener 2 productos con el mismo nombre
        maxlength: [100, 'Product name cannot exceed 100 characters']
    },
    description: {
        type: String,
        required:[true, 'Short description is required'],
        trim: true,
        maxlength: [255, 'Description is too long']
    },
    fullDescription: {
        type: String,
        required:[true, 'Full description is required'],
        trim: true
    },
    price: {
        type: Number,
        required:[true, 'Price is required'],
        min: [0, 'Price cannot be negative']
    },
    image: {
        type: String,
        required: [true, 'Product image URL is required'],
        trim: true
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        trim: true,
        lowercase: true // Para facilitar las búsquedas en el front
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
}, { 
    versionKey: false,
    timestamps: true // Para saber cuándo se creó/actualizó cada producto
 });

module.exports = model("Producto", ProductoSchema);
