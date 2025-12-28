// Importar modelo
const Producto = require("../models/product.model");


// Crear Producto
exports.createProducto = async (req, res) => {

    const {
        name,
        description,
        fullDescription,
        price,
        image,
        category,
        customizable,
        ingredients,
        allergens
    } = req.body;

    try {

        // Crear producto
        const nuevoProducto = await Producto.create({
            name,
            description,
            fullDescription,
            price,
            image,
            category,
            customizable,
            ingredients,
            allergens
        });

        res.status(201).json({
            ok: true,
            message: "Product created successfully",
            data: nuevoProducto
        });

    } catch (error) {
        // Error de Nombre Duplicado
        if (error.code === 11000) {
            return res.status(400).json({
                ok: false,
                message: "A product with this name already exists",
                type: "DUPLICATE_KEY_ERROR"
            });
        }

        // Error de Validación del Schema (Precios, largos, etc)
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

// Obtener todos los productos
exports.getProductos = async (req, res) => {

    try {

        // Buscar todos los productos
        const productos = await Producto.find();

        res.status(200).json({
            ok: true,
            message: "Products retrieved successfully",
            data: productos
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            message: "Internal server error",
            type: "SERVER_ERROR"
        });
    }
};

// Obtener producto por ID
exports.getProductoById = async (req, res) => {

    const { id } = req.params;

    try {

        const producto = await Producto.findById(id);

        // Validar existencia
        if (!producto) {
            return res.status(404).json({
                ok: false,
                message: "Product not found",
                type: "NOT_FOUND"
            });
        }

        res.status(200).json({
            ok: true,
            message: "Product retrieved successfully",
            data: producto
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            message: "Internal server error",
            type: "SERVER_ERROR"
        });
    }
};

// Actualizar producto
exports.updateProducto = async (req, res) => {

    const { id } = req.params;
    const updates = req.body;

    try {

        // Actualizar registro
        const productoActualizado = await Producto.findByIdAndUpdate(
            id,
            { $set: updates },
            { new: true, runValidators: true }
        );

        // Validar existencia
        if (!productoActualizado) {
            return res.status(404).json({
                ok: false,
                message: "Product not found",
                type: "NOT_FOUND"
            });
        }

        res.status(200).json({
            ok: true,
            message: "Product updated successfully",
            data: productoActualizado
        });

    } catch (error) {
        if (error.name === "ValidationError") {
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

// Eliminar producto
exports.deleteProducto = async (req, res) => {

    // Obtener ID desde params
    const { id } = req.params;

    try {

        // Eliminar registro
        const productoEliminado = await Producto.findByIdAndDelete(id);

        // Validar existencia
        if (!productoEliminado) {
            return res.status(404).json({
                ok: false,
                message: "Product not found",
                type: "NOT_FOUND"
            });
        }

        res.status(200).json({
            ok: true,
            message: "Product deleted successfully",
            data: null
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            message: "Internal server error",
            type: "SERVER_ERROR"
        });
    }
};

// GET /productos?category=nombreCategoria
exports.getProductosByCategory = async (req, res) => {

    const { category } = req.query;

    try {

        if (!category) {
            return res.status(400).json({
                ok: false,
                message: "Category is required",
                type: "INVALID_QUERY_PARAM"
            });
        }

        const productos = await Producto.find({ category: category.toLowerCase() });

        res.status(200).json({
            ok: true,
            message: `Products for category '${category}' retrieved`,
            data: productos
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            message: "Internal server error",
            type: "SERVER_ERROR"
        });
    }
};

// GET /productos/destacados
exports.getProductosDestacados = async (req, res) => {

    try {

        const productos = await Producto.find().limit(3).sort({ createdAt: -1 });

        res.status(200).json({
            ok: true,
            message: "Featured products retrieved successfully",
            data: productos
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            message: "Internal server error",
            type: "SERVER_ERROR"
        });
    }
};