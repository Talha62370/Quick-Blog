import jwt from 'jsonwebtoken'
import Blog from '../models/Blog.js';
import Comment from '../models/comment.js';
import User from '../models/user.js'


 export const register = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        // Check if this is the first user - make them admin automatically
        const userCount = await User.countDocuments();
        const actualRole = userCount === 0 ? 'admin' : role;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ 
                success: false, 
                message: "User already exists" 
            });
        }

        // Create new user
        const user = await User.create({ email, password, role });
        
        // Generate token
        const token = jwt.sign(
            { userId: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            success: true,
            token,
            user: { 
                id: user._id, 
                email: user.email, 
                role: user.role 
            }
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};




export const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ 
                success: false, 
                message: "Invalid credentials" 
            });
        }

        // Check password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({ 
                success: false, 
                message: "Invalid credentials" 
            });
        }

        // Generate token
        const token = jwt.sign(
            { userId: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            success: true,
            token,
            user: { 
                id: user._id, 
                email: user.email, 
                role: user.role 
            }
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

export const getAllBlogsAdmin = async (req, res) => {
    try {
        const blogs = await Blog.find({}).sort({createdAt: -1});
        res.json({success: true,blogs})
    } catch (error) {
        res.json({success: false, message: error.message})
    }
}

export const getAllcomments = async (req, res) => {
    try {
        const comments = await Comment.find({}).populate("blog").sort({createdAt: -1})
         res.json({success: true,comments})
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
        
        res.json({success: true, dashboardData})
    } catch (error) {
        res.json({success: false, message: error.message})
    }
}

export const deleteCommentById = async (req, res) => {
    try {
        const {id} = req.params;
        await Comment.findByIdAndDelete(id);
        res.json({success: true, message: 'Comment deleted successfully'})
    } catch (error) {
        res.json({success: false, message: error.message})
    }
}

export const approvedCommentById = async (req, res) => {
    try {
        const {id} = req.params;
        await Comment.findByIdAndUpdate(id, {isApproved: true});
        res.json({success: true, message: 'Comment approved successfully'})
    } catch (error) {
        res.json({success: false, message: error.message})
    }
}