// Dependencias principales
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
require('dotenv').config();

const path = require('path'); 

// Conexión DB
const conectarMongoDBAltas = require('./config/db');

// Rutas
const usuariosRoutes = require("./routes/user.route");
const productosRoutes = require("./routes/product.route");
const blogsRoutes = require("./routes/blog.route");
const addOnsRoutes = require("./routes/add-ons.route");
const sendMail = require('./routes/send-mail.route');

// Crear servidor
const app = express();


// CORS permitido
const allowedOrigins = [
    "http://localhost:4200",
    process.env.FRONTEND_URL];

app.use(cors({
    origin: (origin, callback) => {
        // Permitir Postman y herramientas sin origin
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        callback(new Error("CORS no permitido"));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));


// Middlewares globales
app.use(helmet());
app.use(compression());
app.use(express.json());

// Conectar a Mongo
conectarMongoDBAltas();

// Rutas principales    
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/productos", productosRoutes);
app.use("/api/blogs", blogsRoutes);
app.use("/api/add-ons", addOnsRoutes);
app.use("/api/mail", sendMail);

// Middleware global de errores
app.use((err, req, res, next) => {
    console.error("🔥 Error del servidor:", err.message);
    res.status(500).json({ error: "Error interno del servidor" });
});

// SERVIR ARCHIVOS ESTÁTICOS CON CORS
const corsStaticOptions = {
    origin: allowedOrigins,
    credentials: true
};

// SERVIR ARCHIVOS ESTÁTICOS
// Servir archivos estáticos (imágenes) permitiendo acceso cross-origin.
// Esto es necesario porque Helmet bloquea por defecto recursos
// cargados desde otro dominio/puerto (ej: Angular en localhost:4200).
// Sin esta cabecera, las imágenes se descargan pero el navegador
// las bloquea y no se muestran en el frontend.
app.use(
  '/uploads',
  (req, res, next) => {
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    next();
  },
  express.static(path.join(__dirname, '../uploads'))
);

// Puerto del servidor
const puerto = process.env.PORT || 4000;

// Iniciar servidor
app.listen(puerto, () => {
    console.log(`🚀 Servidor corriendo en puerto ${puerto}`);
});