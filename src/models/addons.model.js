const { Schema, model } = require("mongoose");

// Sub-esquema base para opciones
const OptionWithPriceSchema = new Schema(
    {
        value: { 
            type: String, 
            required: true, 
            trim: true 
        },
        label: { 
            type: String, 
            required: true, 
            trim: true 
        },
        price: {
            type: Number,
            required: true
        }
    },
    { _id: false }
);

const OptionWithoutPriceSchema = new Schema(
    {
        value: { 
            type: String, 
            required: true, 
            trim: true 
        },
        label: { 
            type: String, 
            required: true, 
            trim: true 
        }
    },
    { _id: false }
);

// Esquema principal AddOns
const AddOnsSchema = new Schema(
    {
        weights: {
            type: [OptionWithPriceSchema],
            required: true
        },
        fillings: {
            type: [OptionWithPriceSchema],
            required: true
        },
        flavors: {
            type: [OptionWithoutPriceSchema],
            required: true
        }
    },
    {
        versionKey: false,
        timestamps: true
    }
);

module.exports = model("AddOns", AddOnsSchema);
