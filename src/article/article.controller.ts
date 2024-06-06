import { NextFunction, Request, Response } from "express";
import { decodeToken, getToken, getUserIdFromToken } from "../utils/functions";
import articleService from "./article.service";
import ApiResponse from "../middleware/response";
import { uploadFileToS3 } from "../utils/uploadFile";

class ArticleController {
	async createArticle(req: Request, res: Response, next: NextFunction) {
		const authHeader = req.headers.authorization;

		const { categoryId, content, title } = req.body;
		const token = getToken(authHeader)!;
		const decoded = await decodeToken(token);

		const files = req.files as Express.Multer.File[] | Express.Multer.File;
		const filesPath = files
			? Array.isArray(files)
				? files.map((file) => file.path)
				: [files.path]
			: [""];

		const response = await articleService.createArticle({
			authorId: decoded.userId,
			categoryId,
			content,
			title,
			filesPath: filesPath,
		});

		new ApiResponse(res).success(response, "article created", 201);
	}

	async getAllArticles(req: Request, res: Response, next: NextFunction) {
		const response = await articleService.getAllArticles();
		new ApiResponse(res).success(response, "ALl articles", 200);
	}

	async getArticleById(req: Request, res: Response, next: NextFunction) {
		const id = req.params.id;
		const response = await articleService.getArticleById(id);
		new ApiResponse(res).success(response, "ALl articles", 200);
	}

	async getArticlesByTagId(req: Request, res: Response, next: NextFunction) {
		const tagId = req.params.tagId;
		const response = await articleService.getArticlesByTagId(tagId);
		new ApiResponse(res).success(response, "ALl articles", 200);
	}

	async updateArticle(req: Request, res: Response, next: NextFunction) {
		const id = req.params.id;
		const authHeader = req.headers.authorization;
		const token = getToken(authHeader)!;
		const decoded = await decodeToken(token);
		const { categoryId, content, title } = req.body;

		const files = req.files as Express.Multer.File[];
		let filesPath: string[] = [];
		if (files) {
			const uploadPromises = files.map(async (file) => {
				const key = new Date().getTime().toString() + "-" + file.originalname;
				await uploadFileToS3({
					file: file,
					key,
				});
				return key;
			});
			filesPath = await Promise.all(uploadPromises);
			const response = await articleService.updateArticle(id, {
				authorId: decoded.userId,
				categoryId,
				content,
				title,
				filesPath,
			});
			new ApiResponse(res).success(response, "ALl articles", 200);
		}
	}

	async deleteArticle(req: Request, res: Response, next: NextFunction) {
		const id = req.params.id;
		const response = await articleService.deleteArticle(id);
		new ApiResponse(res).success(response, "ALl articles", 200);
	}

	async likeArticle(req: Request, res: Response, next: NextFunction) {
		const authHeader = req.headers.authorization;
		const token = getToken(authHeader)!;
		const decoded = await decodeToken(token);
		const articleId = req.params.id;

		const response = await articleService.likeArticle(
			articleId,
			decoded.userId
		);
		new ApiResponse(res).success(response, "ALl articles", 200);
	}

	async unlikeArticle(req: Request, res: Response, next: NextFunction) {
		const authHeader = req.headers.authorization;
		const token = getToken(authHeader)!;
		const decoded = await decodeToken(token);
		const articleId = req.params.id;

		const response = await articleService.unlikeArticle(
			articleId,
			decoded.userId
		);
		new ApiResponse(res).success(response, "ALl articles", 200);
	}
}

const articleController = new ArticleController();

export default articleController;
