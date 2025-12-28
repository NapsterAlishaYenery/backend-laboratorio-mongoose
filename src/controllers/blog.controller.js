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
            ok: true,
            message: "Blog post created successfully",
            data: nuevoBlog
        });

    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                ok: false,
                message: "A blog with this title already exists",
                type: "DUPLICATE_TITLE_ERROR"
            });
        }
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

// Obtener todos los blogs
exports.getBlogs = async (req, res) => {

    try {

        // Buscar todos los blogs
        const blogs = await Blog.find().sort({ createdAt: -1 });

        res.status(200).json({
            ok: true,
            message: "Blogs retrieved successfully",
            data: blogs
        });

    } catch (error) {
        res.status(500).json({ 
            ok: false, 
            message: "Internal server error", 
            type: "SERVER_ERROR" 
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
                ok: false,
                message: "Blog post not found",
                type: "NOT_FOUND"
            });
        }

        res.status(200).json({
            ok: true,
            message: "Blog post retrieved successfully",
            data: blog
        });

    } catch (error) {
        res.status(500).json({ 
            ok: false, 
            message: "Internal server error", 
            type: "SERVER_ERROR" 
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
                ok: false,
                message: "Blog post not found",
                type: "NOT_FOUND"
            });
        }

        res.status(200).json({
            ok: true,
            message: "Blog post updated successfully",
            data: blogActualizado
        });

    } catch (error){
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

// Eliminar blog
exports.deleteBlog = async (req, res) => {

    const { id } = req.params;

    try {

        // Eliminar registro
        const blogEliminado = await Blog.findByIdAndDelete(id);

        // Validar existencia
        if (!blogEliminado) {
            return res.status(404).json({
                ok: false,
                message: "Blog post not found",
                type: "NOT_FOUND"
            });
        }

        res.status(200).json({
            ok: true,
            message: "Blog post deleted successfully",
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

// get blog por categoria
exports.getBlogByCategory = async (req, res) => {

    const { category } = req.query;

    if (!category) {
        return res.status(400).json({ 
            ok: false, 
            message: "Category query parameter is required", 
            type: "INVALID_QUERY" 
        });
    }

    try {

        const blogs = await Blog.find({ category: category.toLowerCase() });

        res.status(200).json({
            ok: true,
            message: `Blogs for category '${category}' retrieved`,
            data: blogs
        });

    } catch (error) {
        res.status(500).json({ 
            ok: false, 
            message: "Internal server error", 
            type: "SERVER_ERROR" 
        });
    }
};

// get blog recientes
exports.getRecentBlogs = async (req, res) => {

    try {

        const blogs = await Blog.find().sort({ createdAt: -1 }).limit(3);

       res.status(200).json({
            ok: true,
            message: "Recent blog posts retrieved",
            data: blogs
        });

    } catch (error) {
        res.status(500).json({ 
            ok: false, 
            message: "Internal server error", 
            type: "SERVER_ERROR" 
        });
    }
};