import jwt from 'jsonwebtoken'
import Blog from '../models/Blog.js';
import Comment from '../models/comment.js';


export const adminLogin = async (req, res) => {
    try {
         const {email, password} = req.body;

         if(email !== process.env.ADMIN_EMAIL ||
            password !== process.env.ADMIN_PASSWORD){
                return res.json({Success: false, message: "Inavalid Credentials"})
            }

            const token = jwt.sign({email, role: 'admin'}, process.env.JWT_SECRET)
            res.json({Success: true, token})
    }catch (error) {
     res.json({success: false, message: error.message})
    }
}

export const getAllBlogsAdmin = async (req, res) => {
    try {
        const blogs = await Blog.find({}).sort({createdAt: -1});
        res.json({Success: true,blogs})
    } catch (error) {
        res.json({success: false, message: error.message})
    }
}

export const getAllcomments = async (req, res) => {
    try {
        const comments = await Comment.find({}).populate("blog").sort({createdAt: -1})
         res.json({Success: true,comments})
    } catch (error) {
        res.json({success: false, message: error.message})
    }
}

export const getDashboard = async (req, res) => {
    try {
        const recentBlogs = await Blog.find({}).sort({createdAt: -1}).limit(5)
        const blogs = await Blog.countDocuments();
        const comments = await Comment.countDocuments()
        const drafts = await Blog.countDocuments({isPublished: false})

        const dashboardData = {
            blogs, comments, drafts, recentBlogs
        }
        
        res.json({Success: true, dashboardData})
    } catch (error) {
        res.json({success: false, message: error.message})
    }
}

export const deleteCommentById = async (req, res) => {
    try {
        const {id} = req.params.id;
        await Comment.findByIdAndDelete(id);
        res.json({Success: true, message: 'Comment deleted successfully'})
    } catch (error) {
        res.json({success: false, message: error.message})
    }
}

export const approvedCommentById = async (req, res) => {
    try {
        const {id} = req.params.id;
        await Comment.findByIdAndUpdate(id, {isApproved: true});
        res.json({Success: true, message: 'Comment approved successfully'})
    } catch (error) {
        res.json({success: false, message: error.message})
    }
}