// Middleware de Autenticación JWT
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
   
    const authHeader = req.headers.authorization;

     // Validar formato del token: "Bearer token"
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'No autorizado: Token no proporcionado' });
    }

    const token = authHeader.split(' ')[1];


    try {
        // Verificar token
        const decoded = jwt.verify(token, process.env.JWT_SECRET); 

        // Guardar datos del usuario en request
        req.user = decoded; 
        next(); 

    } catch (error) {
        return res.status(401).json({ error: "Token inválido" });
    }
};

module.exports = authMiddleware;