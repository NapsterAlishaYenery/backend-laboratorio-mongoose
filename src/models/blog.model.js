const { Schema, model } = require("mongoose");

const BlogSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    excerpt: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    author: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    tags: {
        type: [String],
        default: []
    }
}, { versionKey: false });

module.exports = model("Blog", BlogSchema);
