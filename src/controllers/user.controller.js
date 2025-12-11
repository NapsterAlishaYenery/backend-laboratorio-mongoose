// Importar dependencias
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//importar modelo mongoose
const Usuario = require("../models/user.model");

// Registrar Usuario
exports.signUpUser = async (req, res) => {
    // Obtenemos los campos desde el body
    const { 
        nombre, 
        apellido, 
        email, 
        username, 
        password, 
        telefono, 
        edad,     
        direccion 
    } = req.body;

    try {
        //Verificar si el email o username existen
        const existe = await Usuario.findOne({ $or: [{ email }, { username }] });

        if (existe) {
            return res.status(400).json({ error: "Email o username ya están registrados" });
        }

        //Encriptar password
        const salt = await bcrypt.genSalt(10);
        const passEncrypt = await bcrypt.hash(password, salt);

        //Crear usuario
        const nuevoUsuario = await Usuario.create({
            nombre,
            apellido,
            email,
            username,
            password_hash: passEncrypt,
            telefono, 
            edad,     
            direccion
        });

        // Devolver respuesta consistente
        res.status(201).json({
            data: {
                id: nuevoUsuario._id,
                nombre: nuevoUsuario.nombre,
                apellido: nuevoUsuario.apellido,
                email: nuevoUsuario.email,
                username: nuevoUsuario.username,
                creadoEn: nuevoUsuario.creadoEn,
                telefono: nuevoUsuario.telefono,
                edad: nuevoUsuario.edad,
                direccion: nuevoUsuario.direccion,
            },
            message: "Usuario registrado correctamente",
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al registrar el usuario" });
    }
};

// Login de Usuario
exports.signInUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        //Buscar usuario
        const usuario = await Usuario.findOne({ username }).select("+password_hash");

        if (!usuario)
            return res.status(401).json({ error: "Credenciales inválidas" });

        //Validar password
        const ok = await bcrypt.compare(password, usuario.password_hash);
        if (!ok)
            return res.status(401).json({ error: "Password incorrecta" });

        //Crear token
        const token = jwt.sign(
            {
                id: usuario._id,
                username: usuario.username,
            },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        // 4. Respuesta limpia (sin password_hash)
        const userResponse = usuario.toObject();
        delete userResponse.password_hash;

        res.json({
            token,
            user: userResponse,
            message: "Login exitoso"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al iniciar sesión" });
    }
};

// Obtener Perfil
exports.getPerfil = async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.user.id).select("-password_hash");

        res.json({
            data: usuario,
            message: "Perfil obtenido correctamente"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener perfil" });
    }
};

// Obtener todos los usuarios
exports.getAllUsers = async (req, res) => {
    try {
        
        const usuarios = await Usuario.find().select("-password_hash");

        res.json({
            data: usuarios,
            message: "Usuarios obtenidos correctamente"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener usuarios" });
    }
};

// Actualizar Usuario
exports.UpDateUser = async (req, res) => {

    const  id  =  req.user.id; 
    const updates = req.body; 



    try {

        // Evitar que alguien intente actualizar la contraseña aquí
        if (updates.password || updates.password_hash) {
            return res.status(400).json({
                error: "La contraseña no se puede actualizar desde esta ruta"
            });
        }
        
        const usuarioActualizado = await Usuario.findByIdAndUpdate(
            id,
            { $set: updates },
            { new: true, runValidators: true }
        ).select("-password_hash");

        //Verificar si el usuario fue encontrado
        if (!usuarioActualizado) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        // 5. Respuesta exitosa
        res.status(200).json({
            data: usuarioActualizado,
            message: "Usuario actualizado exitosamente",
        });

    } catch (error) {
        // Error de validación de Mongoose
        if (error.name === 'ValidationError') {
            return res.status(400).json({ error: error.message });
        }

        res.status(500).json({ error: "Error interno del servidor al actualizar el usuario" });
    }
};