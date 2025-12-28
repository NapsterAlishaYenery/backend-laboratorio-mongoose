const { Schema, model } = require("mongoose");

const BlogSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Blog title is required'],
        trim: true,
    },
    excerpt: {
        type: String,
        required: [true, 'Excerpt (summary) is required'],
        trim: true,
        maxlength: [300, 'Excerpt cannot exceed 300 characters']
    },
    content: {
        type: String,
        required: [true, 'Content is required'],
        trim: true
    },
    image: {
        type: String,
        required: [true, 'Main image URL is required'],
        trim: true
    },
    author: {
        type: String,
        required: [true, 'Author name is required'],
        trim: true
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        trim: true,
        lowercase: true
    },
    tags: {
        type: [String],
        default: []
    }
}, { 
    versionKey: false,
    timestamps: true // Esto genera createdAt y updatedAt automáticamente
 });

module.exports = model("Blog", BlogSchema);
