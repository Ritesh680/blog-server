import mongoose, { ObjectId } from "mongoose";
import Article from "./article.model";

interface ICreateArticle {
	title: string;
	content: string;
	authorId: string;
	categoryId: string;
	filesPath?: string[];
}
class ArticleService {
	article = Article;

	async createArticle(body: ICreateArticle) {
		const response = await this.article.create(body);
		return response;
	}

	async getAllArticles() {
		return await this.article?.aggregate([
			{
				$lookup: {
					from: "users",
					localField: "authorId",
					foreignField: "_id",
					as: "user",
					pipeline: [{ $project: { _id: 1, username: 1, imagePath: 1 } }],
				},
			},
		]);
	}
	async getArticleById(id: string) {
		const res = await this.article.aggregate([
			{
				$match: {
					_id: new mongoose.Types.ObjectId(id),
				},
			},
			{
				$lookup: {
					from: "users",
					localField: "authorId",
					foreignField: "_id",
					as: "user",
					pipeline: [
						{
							$project: {
								_id: 1,
								username: 1,
								imagePath: 1,
							},
						},
					],
				},
			},
		]);
		return res[0];
	}

	async likeArticle(articleId: string, userId: string) {
		const article = await this.article.findById(articleId);
		if (!article) {
			throw new Error("Article not found");
		}
		const isLiked = article.likes.includes(userId as any);
	}

	async updateArticle(id: string, body: ICreateArticle) {
		return await this.article.findByIdAndUpdate(id, body);
	}

	async deleteArticle(id: string) {
		return await this.article.findByIdAndDelete(id);
	}
}
const articleService = new ArticleService();
export default articleService;
