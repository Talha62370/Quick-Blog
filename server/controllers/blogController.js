import imagekit from '../configs/imageKit.js';
import Blog from '../models/Blog.js';
import Comment from '../models/comment.js';
import main from '../configs/gemini.js';

export const addBlog = async (req, res) => {
    try {
        // Parse JSON data from 'blog' field
        const { title, subTitle, description, category, isPublished } = JSON.parse(req.body.blog);
        const imageFile = req.file;

        // Validate required fields
        if (!title || !description || !category || !imageFile) {
            return res.status(400).json({
                success: false,
                message: "Title, description, category, and image are required"
            });
        }

        // Upload directly from memory buffer (no file system operations)
        const response = await imagekit.upload({
            file: imageFile.buffer, // Use the buffer from memory
            fileName: imageFile.originalname,
            folder: "/blogs",
        });

        const optimizedImageUrl = imagekit.url({
            path: response.filePath,
            transformation: [
                { quality: 'auto' },
                { format: 'webp' },
                { width: '1280' }
            ]
        });

        // Create blog in database
        await Blog.create({
            title,
            subTitle,
            description,
            category,
            image: optimizedImageUrl,
            isPublished: isPublished || false
        });

        res.json({ success: true, message: "Blog added successfully" });

    } catch (error) {
        console.error("Error in addBlog:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find({ isPublished: true });
        res.json({ success: true, blogs });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getAllBlogsAdmin = async (req, res) => {
    try {
        const blogs = await Blog.find({});
        res.json({ success: true, blogs });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getBlogById = async (req, res) => {
    try {
        const { id } = req.params;
        const blog = await Blog.findById(id);
        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found"
            });
        }
        res.status(200).json({ success: true, blog });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteBlogById = async (req, res) => {
    try {
        const { id } = req.params;
        await Blog.findByIdAndDelete(id);
        await Comment.deleteMany({ blog: id });
        res.status(200).json({
            success: true,
            message: 'Blog deleted successfully'
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const togglePublisd = async (req, res) => {
    try {
        const { id } = req.body;
        const blog = await Blog.findById(id);
        
        if (!blog) {
            return res.status(404).json({
                success: false,
                message: 'Blog not found'
            });
        }
        
        blog.isPublished = !blog.isPublished;
        await blog.save();
        
        res.json({ success: true, message: 'Blog status updated' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const addComment = async (req, res) => {
    try {
        const { blog, name, content } = req.body;
        
        if (!blog || !name || !content) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }
        
        await Comment.create({ blog, name, content });
        res.json({ success: true, message: 'Comment added for review' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getBlogComments = async (req, res) => {
    try {
        const { blogId } = req.body;
        const comments = await Comment.find({
            blog: blogId,
            isApproved: true
        }).sort({ createdAt: -1 });
        
        res.json({ success: true, comments });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const generateContent = async (req, res) => {
    try {
        const { prompt } = req.body;
        const content = await main(prompt + ' Generate a blog content for this topic in simple text format');
        res.json({ success: true, content });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};