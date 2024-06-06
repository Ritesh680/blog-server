import express from "express";
import { bodyValidator } from "../middleware/zod.validator";
import createCommentDTO from "./dto/comment.dto";
import commentController from "./comment.controller";
import authMiddleware from "../middleware/auth.middleware";
const router = express.Router();

router.post(
  "/",
  authMiddleware.checkAuthenticated,
  bodyValidator(createCommentDTO),
  commentController.createComment,
);

router.get("/", commentController.getAllComments);
router.get("/:id", commentController.getCommentById);
router.put(
  "/:id",
  authMiddleware.checkAuthenticated,
  bodyValidator(createCommentDTO),
  commentController.updateComment,
);
router.delete(
  "/:id",
  authMiddleware.checkAuthenticated,
  commentController.deleteComment,
);

module.exports = router;
