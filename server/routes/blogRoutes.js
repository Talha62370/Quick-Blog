import express from 'express';
import { addBlog, addComment, deleteBlogById,generateContent,getAllBlogs, getAllBlogsAdmin, getBlogById,
 getBlogComments, togglePublisd, } from '../controllers/blogController.js';
import upload from '../middleware/multer.js';
import auth from '../middleware/auth.js';


const blogRouter = express.Router();

blogRouter.post("/add", upload.single('image'), auth, addBlog)

blogRouter.get('/all', getAllBlogs);
blogRouter.get('/admin/all', auth, getAllBlogsAdmin); 
blogRouter.get('/:id', getBlogById);
blogRouter.delete('/:id',auth, deleteBlogById);
blogRouter.post('/toggle-publish',auth, togglePublisd);
blogRouter.post('/add-comment', addComment);
blogRouter.post('/comments', getBlogComments);
blogRouter.post('/generate', auth, generateContent);


export default blogRouter;