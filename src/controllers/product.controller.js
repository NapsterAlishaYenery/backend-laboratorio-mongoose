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
            data: nuevoProducto,
            message: "Producto creado correctamente"
        });

    } catch (error) {
        res.status(500).json({
            error: "Error al crear el producto"
        });
    }
};

// Obtener todos los productos
exports.getProductos = async (req, res) => {

    try {

        // Buscar todos los productos
        const productos = await Producto.find();

        res.status(200).json({
            data: productos,
            message: "Productos obtenidos correctamente"
        });

    } catch (error) {
        res.status(500).json({
            error: "Error al obtener los productos"
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
                error: "Producto no encontrado"
            });
        }

        res.status(200).json({
            data: producto,
            message: "Producto obtenido correctamente"
        });

    } catch (error) {

        res.status(500).json({
            error: "Error al obtener el producto"
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
                error: "Producto no encontrado"
            });
        }

        res.status(200).json({
            data: productoActualizado,
            message: "Producto actualizado correctamente"
        });

    } catch (error) {

        if (error.name === "ValidationError") {
            return res.status(400).json({ error: error.message });
        }

        res.status(500).json({
            error: "Error al actualizar el producto"
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
                error: "Producto no encontrado"
            });
        }

        res.status(200).json({
            message: "Producto eliminado correctamente"
        });

    } catch (error) {

        res.status(500).json({
            error: "Error al eliminar el producto"
        });
    }
};

// GET /productos?category=nombreCategoria
exports.getProductosByCategory = async (req, res) => {

    const { category } = req.query;

    try {

        if (!category) return res.status(400).json({ error: "Se debe especificar una categoría" });

        const productos = await Producto.find({ category });

        res.status(200).json({
            data: productos,
            message: `Productos de la categoría ${category} obtenidos correctamente`
        });

    } catch (error) {

        res.status(500).json({ error: "Error al obtener productos por categoría" });
    }
};

// GET /productos/destacados
exports.getProductosDestacados = async (req, res) => {

    try {

        const productos = await Producto.find().limit(3); // o algún criterio de destacados que se me ocurra

        res.status(200).json({
            data: productos,
            message: "Productos destacados obtenidos correctamente"
        });

    } catch (error) {

        res.status(500).json({ error: "Error al obtener productos destacados" });
    }
};