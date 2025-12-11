// Dependencias
const mongoose = require('mongoose');
require('dotenv').config();

/**
 * Conecta a MongoDB Atlas utilizando la variable MONGO_URI del archivo .env.
 * Si la conexión falla, el servidor se detiene para evitar estados inestables.
 */
const conectarMongoDBAltas = async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log('🔥 Conectado a MongoDB Atlas');
    }catch (error){
        console.error('❌ Error conectando a MongoDB:', error.message);
        process.exit(1); // Forzar cierre si falla
    }
}

// Exportación de la función sin desestructuración
module.exports = conectarMongoDBAltas;
