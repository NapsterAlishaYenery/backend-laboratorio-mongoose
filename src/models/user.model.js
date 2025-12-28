//Modelo para la entidad usuaio usando Mongoose

// importar las librerias
const { Schema, model } = require("mongoose");

// Definición interna del Regex para el email
const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;


//Definir el modelo y sus campos
const UsuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'First name is required'],
        trim: true,
        maxlength: [50, 'First name cannot exceed 50 characters']
    },
    apellido: {
        type: String,
        required: [true, 'Last name is required'],
        trim: true,
        maxlength: [50, 'Last name cannot exceed 50 characters']
    },
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        index: true,
        trim: true,
        lowercase: true,
        minlength: [3, 'Username must be at least 3 characters'],
        maxlength: [255, 'Username cannot exceed 255 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        index: true,
        trim: true,
        lowercase: true,
        match: [emailRegex, 'Please provide a valid email address'],
        maxlength: [255, 'Email cannot exceed 255 characters']
    },
    password_hash: {
        type: String,
        required: [true, 'Password is required'],
        select: false     // Seguridad EXTRA
    },

    // --- NUEVOS CAMPOS SIMPLES ---
    telefono: {
        type: String,
        trim: true,
        maxlength: [20, 'Phone number cannot exceed 20 characters']
    },
    edad: {
        type: Number,
        min: [1, 'Age must be at least 1'],
        max: [120, 'Age cannot exceed 120']
    },

    direccion: {
        calle: { 
            type: String, 
            trim: true, 
            maxlength: [255, 'Street address is too long']
        },
        ciudad: { 
            type: String, 
            trim: true, 
            maxlength: [100, 'City name is too long']
        },
        municipio: { 
            type: String, 
            trim: true, 
            maxlength: [100, 'Municipality name is too long']
        },
        codigo_postal: { 
            type: String, 
            trim: true, 
            maxlength: [10, 'Zip code is too long']
        }
    }
}, {
    versionKey: false, // Quita el campo __v de la base de datos 
    timestamps: true // Esto añade updatedAt automáticamente
});

module.exports = model("Usuario", UsuarioSchema);