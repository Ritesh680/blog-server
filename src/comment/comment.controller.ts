import { NextFunction, Request, Response } from "express";
import commentService from "./comment.service";
import ApiResponse from "../middleware/response";
import { getUserIdFromToken } from "../utils/functions";

class CommentController {
	async createComment(req: Request, res: Response, next: NextFunction) {
		const { articleId, comment } = req.body;

		const userId = await getUserIdFromToken(req.headers.authorization);

		if (!userId) {
			return new ApiResponse(res).failed("Token verification failed");
		}

		const response = await commentService.createComment({
			articleId,
			userId,
			comment,
		});
		new ApiResponse(res).success(response, "comment added", 201);
	}

	async getAllComments(req: Request, res: Response, next: NextFunction) {
		const response = await commentService.getAllComment();
		new ApiResponse(res).success(response, "comment added", 201);
	}

	async getCommentById(req: Request, res: Response, next: NextFunction) {
		const id = req.params.id;
		const response = await commentService.getCommentByBlogId(id);
		new ApiResponse(res).success(response, "comment added", 201);
	}

	async updateComment(req: Request, res: Response, next: NextFunction) {
		const id = req.params.id;
		const { articleId, comment } = req.body;

		const userId = await getUserIdFromToken(req.headers.authorization);

		if (!userId) {
			return new ApiResponse(res).failed("Token verification failed");
		}
		const response = await commentService.updateComment(id, {
			articleId,
			comment,
			userId,
		});
		new ApiResponse(res).success(response, "comment added", 201);
	}

	async deleteComment(req: Request, res: Response, next: NextFunction) {
		const id = req.params.id;
		const response = await commentService.deleteComment(id);
		new ApiResponse(res).success(response, "comment deleted", 201);
	}
}

const commentController = new CommentController();

export default commentController;
