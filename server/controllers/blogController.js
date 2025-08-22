import fs from 'fs/promises'
import imagekit from '../configs/imageKit.js';
import Blog from '../models/Blog.js'
import Comment from '../models/comment.js';
import main from '../configs/gemini.js';

export const addBlog = async (req, res) => {

    try {
        // Parse JSON data from 'blog' field
        const { title, subTitle, description, category, isPublished } = JSON.parse(req.body.blog);
        const imageFile = req.file;

        // Validate required fields
        if (!title || !description || !category || !imageFile) {
            return res.json({success: false, message: "Missing required field"})
        }

        
        const fileBuffer = await fs.readFile(imageFile.path);

        // Upload to ImageKit
        const response = await imagekit.upload({
            file: fileBuffer,
            fileName: imageFile.originalname,
            folder: "/blogs",
        });

        const optimizedImageUrl = imagekit.url({
            path: response.filePath, 
            transformation: [
                {quality: 'auto'},
                {format: 'webp'},
                {width: '1280'}
            ]
        });

        const image = optimizedImageUrl;
        
    await Blog.create({title, subTitle, description, category, image, 
        isPublished})
        
        res.json({success:true, message: "Blog added successfully"})
            
    } catch (error) {
        res.json({success:false, message: error.message})
    };
 }

 export const getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find({ isPublished: true }); // Only published blogs
        res.json({ success: true, blogs });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

export const getAllBlogsAdmin = async (req, res)=> {
     try{
        const blogs = await Blog.find({})
        res.json({success: true, blogs})
     } catch (error) {
        res.json({success: false, message: error.message})
     }
}

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
        const {id} = req.body;
        const blog = await Blog.findById(id);
        blog.isPublished = !blog.isPublished;
         await blog.save(); 
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

export const getBlogComments = async (req, res) => {
   try {
    const {blogId} = req.body;
    const comments = await Comment.find({blog: blogId, isApproved: true}).sort
    ({createdAt: -1})
     res.json({success: true, comments})
   } catch (error) {
     res.json({success: false, message: error.message})
   }
}

// export const getDashboardData = async (req, res) => {
//     try {
//         // Get total blogs count
//         const totalBlogs = await Blog.countDocuments();
        
//         // Get total comments count
//         const totalComments = await Comment.countDocuments();
        
//         // Get drafts count (unpublished blogs)
//         const drafts = await Blog.countDocuments({ isPublished: false });
        
//         // Get recent blogs (last 5 blogs)
//         const recentBlogs = await Blog.find().sort({ createdAt: -1 }).limit(5);

//         const dashboardData = {
//             blogs: totalBlogs,
//             comments: totalComments,
//             drafts: drafts,
//             recentBlogs: recentBlogs
//         };

//         res.json({ success: true, dashboardData });
//     } catch (error) {
//         res.json({ success: false, message: error.message });
//     }
// }


export const generateContent = async (req, res) => {
 try {
    const {prompt} = req.body;
   const content = await main(prompt + ' Generate a blog content for this topic for this topic in simple text formate')
   res.json({success: true, content})
 } catch (error) {
     res.json({ success: false, message: error.message });
 }
}