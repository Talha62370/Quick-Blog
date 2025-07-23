import fs from 'fs/promises'
import imagekit from '../configs/imageKit.js';
import Blog from '../models/Blog.js'
import Comment from '../models/comment.js';


export const addBlog = async (req, res)=> {
    try{
        const {title, subTitle, description, category, isPublished} = JSON.parse
        (req.body.blog);
        const imageFile = req.file;

        // Check if all fields are present 
        if(!title || !description || !category || !imageFile){
            return res.json({success: false, message: "Missing required fields"})
        }

        const fileBuffer = fs.readFileSync(imageFile.path)

        // Upload image to imageKit
        const response =  await imagekit.upload({
            file: fileBuffer,
            fileName: imageFile.originalname,
            folder: "/blogs"
        })

        // optimization through imageKit URL transformation
        const optimizedImageUrl = imagekit.url({
            path: response.filePath,
            transformation:[
                {quality: 'auto'},  // Auto compression
                {format: 'webp'},   // convert to modern format 
                {width: '1280'}     //Width resizing
            ]
        });

        const image = optimizedImageUrl;

        await Blog.create({title, subTitle, description, category, image,
           isPublished})

            res.json({success: true, message: "Blog added successfully"})
        
    }catch (error) {
       res.json({success: false, message: error.message})
    }
}

export const getAllBlogs = async (req, res)=> {
     try{
        const blogs = await Blog.find({isPublished: true})
        res.json({success: true, blogs})
     } catch (error) {
        res.json({success: false, message: error.message})
     }
}

export const getBlogById = async (req, res) => {
    try {
        const {blogId} = req.params;
        const blog = await Blog.findById(blogId)
        if(!blog){
            return res.json({success: false, message: "Blog not found"});
        }
          res.json({success: true, blog})
    } catch (error) {
        res.json({success: false, message: error.message})
    }
}

export const deleteBlogById = async (req, res) => {
    try {
        const {id} = req.body;
        await Blog.findByIdAndDelete(id)

    // Delete all comments associated with the blog
    await Comment.daleteMany({blog: id});;

        res.json({success: true, message: 'Blog deleted successfully'})
    } catch (error) {
        res.json({success: false, message: error.message})
    }
}

export const togglePublisd = async (req, res) => {
    try {
        const {id} = req.body;
        const blog = await Blog.findById(id);
        blog.isPublished = !blog.isPublished;
        res.json({success: true, message: 'Blog status updated'})
    } catch (error) {
      res.json({success: false, message: error.message})
    }
}

export const addComment = async (req, res) => {
    try {
        const {blog, name, content} = req.body;
        await Comment.create({blog, name, content})
        res.json({success: true, message: 'Comment added for review'})
    } catch (error) {
      res.json({success: false, message: error.message})
    }
}

export const getBlogComment = async (req, res) => {
   try {
    const {blogId} = req.body;
    const comments = await Comment.find({blog: blogId, isApproved: true}).sort
    ({createdAt: -1})
     res.json({success: true, comments})
   } catch (error) {
     res.json({success: false, message: error.message})
   }
}