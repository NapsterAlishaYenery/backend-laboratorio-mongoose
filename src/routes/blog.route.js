const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth.middleware");
const writeLimiter = require("../middleware/rateLimiter.middleware");
const validate = require("../middleware/validateBlogs.middleware");
const controller = require("../controllers/blog.controller");

// Public
router.get("/recientes", controller.getRecentBlogs);
router.get("/categoria", controller.getBlogByCategory);
router.get("/", controller.getBlogs);
router.get("/:id", validate.id, controller.getBlogById);

// Private
router.post("/", auth, writeLimiter, validate.registro, controller.createBlog);
router.patch("/:id", auth, writeLimiter, validate.id, validate.upDate, controller.updateBlog);
router.delete("/:id", auth, writeLimiter, validate.id, controller.deleteBlog);

module.exports = router;
