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
            ok: true,
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
            message: "User registered successfully"
        });

    } catch (error) {
        // Error de Duplicado (Email/Username)
        if (error.code === 11000) {
            return res.status(400).json({
                ok: false,
                message: "Email or Username already exists",
                type: "DUPLICATE_KEY_ERROR"
            });
        }

        // Error de Validación del Schema
        if (error.name === 'ValidationError') {
            const firstError = Object.values(error.errors)[0].message;
            return res.status(400).json({
                ok: false,
                message: firstError,
                type: "VALIDATION_ERROR"
            });
        }

        res.status(500).json({
            ok: false,
            message: "Internal server error",
            type: "SERVER_ERROR"
        });
    }
};

// Login de Usuario
exports.signInUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        //Buscar usuario
        const usuario = await Usuario.findOne({ username }).select("+password_hash");

        if (!usuario)
            return res.status(401).json({
                ok: false,
                message: "Invalid credentials",
                type: "AUTH_ERROR"
            });

        //Validar password
        const ok = await bcrypt.compare(password, usuario.password_hash);
        if (!ok)
            return res.status(401).json({
                ok: false,
                message: "Invalid credentials",
                type: "AUTH_ERROR"
            });

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
            ok: true,
            message: "Login successful",
            data: {                // ✅ Envolvemos todo en data
                token,
                user: userResponse
            }
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            message: "Internal server error",
            type: "SERVER_ERROR"
        });
    }
};

// Obtener Perfil
exports.getPerfil = async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.user.id).select("-password_hash");

        if (!usuario) {
            return res.status(404).json({
                ok: false,
                message: "User not found",
                type: "NOT_FOUND"
            });
        }

        res.json({
            ok: true,
            message: "Profile retrieved successfully",
            data: usuario
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            message: "Internal server error",
            type: "SERVER_ERROR"
        });
    }
};

// Obtener todos los usuarios
exports.getAllUsers = async (req, res) => {
    try {

        const usuarios = await Usuario.find().select("-password_hash");

        res.json({
            ok: true,
            message: "Users list retrieved",
            data: usuarios
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            message: "Internal server error",
            type: "SERVER_ERROR"
        });
    }
};

// Actualizar Usuario
exports.UpDateUser = async (req, res) => {

    const id = req.user.id;
    const updates = req.body;



    try {

        // // Evitar que alguien intente actualizar la contraseña aquí
        // if (updates.password || updates.password_hash) {
        //     return res.status(400).json({
        //         error: "La contraseña no se puede actualizar desde esta ruta"
        //     });
        // }

        const usuarioActualizado = await Usuario.findByIdAndUpdate(
            id,
            { $set: updates },
            { new: true, runValidators: true }
        )

        if (!usuarioActualizado) {
            return res.status(404).json({
                ok: false,
                message: "User not found",
                type: "NOT_FOUND"
            });
        }
        // 5. Respuesta exitosa
        res.status(200).json({
            ok: true,
            message: "User updated successfully",
            data: usuarioActualizado
        });

    } catch (error) {
        if (error.name === 'ValidationError') {
            const firstError = Object.values(error.errors)[0].message;
            return res.status(400).json({
                ok: false,
                message: firstError,
                type: "VALIDATION_ERROR"
            });
        }
        res.status(500).json({
            ok: false,
            message: "Internal server error",
            type: "SERVER_ERROR"
        });
    }
};