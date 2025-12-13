//Modelo para la entidad usuaio usando Mongoose

// importar las librerias
const { Schema, model } = require("mongoose");


//Definir el modelo y sus campos
const UsuarioSchema = new Schema({
    nombre: {
        type: String,
        required: true,
        trim: true,
        maxlength: 50
    },
    apellido: {
        type: String,
        required: true,
        trim: true,
        maxlength: 50
    },
    username: {
        type: String,
        required: true,
        unique: true,
        index: true,
        trim: true,
        lowercase: true,
        maxlength: 255
    },
    email: {
        type: String,
        required: true,
        unique: true,
        index: true,
        trim: true,
        lowercase: true,
        maxlength: 255
    },
    password_hash: {
        type: String,
        required: true,
        select: false     // Seguridad EXTRA
    },
    creadoEn: {
        type: Date,
        default: Date.now
    },

    // --- NUEVOS CAMPOS SIMPLES ---
    telefono: {
        type: String,
        trim: true,
        maxlength: 20
    },
    edad: {
        type: Number,
        min: 1,
        max: 120
    },

    direccion: {
        calle: { 
            type: String, 
            trim: true, 
            maxlength: 255 
        },
        ciudad: { 
            type: String, 
            trim: true, 
            maxlength: 100 
        },
        municipio: { 
            type: String, 
            trim: true, 
            maxlength: 100 
        },
        codigo_postal: { 
            type: String, 
            trim: true, 
            maxlength: 10
        }
    }
}, {
    versionKey: false
});

module.exports = model("Usuario", UsuarioSchema);