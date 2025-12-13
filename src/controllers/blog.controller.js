// Importar modelo
const Blog = require("../models/blog.model");

// Crear Blog
exports.createBlog = async (req, res) => {

    const {
        title,
        excerpt,
        content,
        image,
        author,
        category,
        tags
    } = req.body;

    try {

        // Crear blog
        const nuevoBlog = await Blog.create({
            title,
            excerpt,
            content,
            image,
            author,
            category,
            tags
        });

        // Respuesta consistente
        res.status(201).json({
            data: nuevoBlog,
            message: "Blog creado correctamente"
        });

    } catch (error) {

        res.status(500).json({
            error: "Error al crear el blog"
        });
    }
};

// Obtener todos los blogs
exports.getBlogs = async (req, res) => {

    try {

        // Buscar todos los blogs
        const blogs = await Blog.find();

        res.status(200).json({
            data: blogs,
            message: "Blogs obtenidos correctamente"
        });

    } catch (error) {

        res.status(500).json({
            error: "Error al obtener los blogs"
        });
    }
};

// Obtener blog por ID
exports.getBlogById = async (req, res) => {

    const { id } = req.params;

    try {

        // Buscar blog por ID
        const blog = await Blog.findById(id);

        // Validar existencia
        if (!blog) {
            return res.status(404).json({
                error: "Blog no encontrado"
            });
        }

        res.status(200).json({
            data: blog,
            message: "Blog obtenido correctamente"
        });

    } catch (error) {

        res.status(500).json({
            error: "Error al obtener el blog"
        });
    }
};

// Actualizar blog
exports.updateBlog = async (req, res) => {

    const { id } = req.params;
    const updates = req.body;

    try {

        // Actualizar registro
        const blogActualizado = await Blog.findByIdAndUpdate(
            id,
            { $set: updates },
            { new: true, runValidators: true }
        );

        // Validar existencia
        if (!blogActualizado) {
            return res.status(404).json({
                error: "Blog no encontrado"
            });
        }

        res.status(200).json({
            data: blogActualizado,
            message: "Blog actualizado correctamente"
        });

    } catch (error) {

        // Error de validación de mongoose
        if (error.name === "ValidationError") {
            return res.status(400).json({ error: error.message });
        }

        res.status(500).json({
            error: "Error al actualizar el blog"
        });
    }
};

// Eliminar blog
exports.deleteBlog = async (req, res) => {

    const { id } = req.params;

    try {

        // Eliminar registro
        const blogEliminado = await Blog.findByIdAndDelete(id);

        // Validar existencia
        if (!blogEliminado) {
            return res.status(404).json({
                error: "Blog no encontrado"
            });
        }

        res.status(200).json({
            message: "Blog eliminado correctamente"
        });

    } catch (error) {

        res.status(500).json({
            error: "Error al eliminar el blog"
        });
    }
};

// get blog por categoria
exports.getBlogByCategory = async (req, res) => {

    const { category } = req.query;

    if (!category) {
        return res.status(400).json({ error: "Se debe especificar una categoría" });
    }

    try {

        const blogs = await Blog.find({ category });

        res.status(200).json({
            data: blogs,
            message: `Blogs de la categoría ${category} obtenidos correctamente`
        });

    } catch (error) {

        res.status(500).json({ error: "Error al obtener los blogs por categoría" });
    }
};

// get blog recientes
exports.getRecentBlogs = async (req, res) => {

    try {

        const blogs = await Blog.find().sort({ createdAt: -1 }).limit(3);

        res.status(200).json({
            data: blogs,
            message: "Blogs recientes obtenidos correctamente"
        });

    } catch (error) {

        res.status(500).json({ error: "Error al obtener blogs recientes" });
    }
};