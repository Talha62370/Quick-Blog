import express from 'express'
import { adminLogin, approvedCommentById, deleteCommentById, getAllBlogsAdmin, 
getAllcomments, 
getDashboard} from '../controllers/admincontroller.js'
import auth from '../middleware/auth.js';

const adminRouter = express.Router()

adminRouter.post("/login", adminLogin);
adminRouter.get('/comments',auth, getAllcomments);
adminRouter.get('/blog',auth, getAllBlogsAdmin);
adminRouter.delete('/delete-comment',auth, deleteCommentById);
adminRouter.put('/approved-comment',auth, approvedCommentById);
adminRouter.get('/dashboard',auth, getDashboard);


export default adminRouter;