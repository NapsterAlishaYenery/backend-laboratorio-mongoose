const { Schema, model } = require("mongoose");

// Sub-esquema base para opciones
const OptionWithPriceSchema = new Schema(
    {
        value: {
            type: String,
            required: [true, 'Option value is required'],
            trim: true
        },
        label: {
            type: String,
            required: [true, 'Option label is required'],
            trim: true
        },
        price: {
            type: Number,
            required: [true, 'Option price is required'],
            min: [0, 'Price cannot be negative']
        }
    },
    { _id: false }
);

const OptionWithoutPriceSchema = new Schema(
    {
        value: {
            type: String,
            required: [true, 'Option value is required'],
            trim: true
        },
        label: {
            type: String,
            required: [true, 'Option label is required'],
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
            required: true,
            validate: {
                validator: function(v) { return v && v.length > 0; },
                message: 'At least one weight option is required'
            }
        },
        fillings: {
            type: [OptionWithPriceSchema],
            required: true,
            validate: {
                validator: function(v) { return v && v.length > 0; },
                message: 'At least one filling option is required'
            }
        },
        flavors: {
            type: [OptionWithoutPriceSchema],
            required: true,
            validate: {
                validator: function(v) { return v && v.length > 0; },
                message: 'At least one flavor option is required'
            }
        }
    },
    {
        versionKey: false,
        timestamps: true
    }
);

module.exports = model("AddOns", AddOnsSchema);
