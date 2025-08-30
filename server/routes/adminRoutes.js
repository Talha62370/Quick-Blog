import express from "express";
import {
  register,
  adminLogin,
  approvedCommentById,
  deleteCommentById,
  getAllBlogsAdmin,
  getAllcomments,
  getDashboard,
} from "../controllers/admincontroller.js";
import auth from "../middleware/auth.js";

const adminRouter = express.Router();

adminRouter.post("/register", register);
adminRouter.post("/login", adminLogin);
adminRouter.get("/comments", auth, getAllcomments);
adminRouter.get("/blogs", auth, getAllBlogsAdmin);
adminRouter.delete("/delete-comment/:id", auth, deleteCommentById);
adminRouter.put("/approved-comment/:id", auth, approvedCommentById);
adminRouter.get("/dashboard", auth, getDashboard);

export default adminRouter;
