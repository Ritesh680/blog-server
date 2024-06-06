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
					pipeline: [
						{
							$unwind: { path: "$imagePath", preserveNullAndEmptyArrays: true },
						},
						{ $project: { _id: 1, username: 1, imagePath: 1 } },
					],
				},
			},
			{
				$lookup: {
					from: "tags",
					localField: "tag",
					foreignField: "_id",
					as: "tag",
					pipeline: [{ $project: { _id: 1, name: 1 } }],
				},
			},
			{ $unwind: { path: "$tag", preserveNullAndEmptyArrays: true } },
			{ $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
		]);
	}

	async getArticlesByUserId(userId: string) {
		const res = await this.article.find({ authorId: userId });
		//get articles id
		const articlesId = res.map((article) => article._id);

		//get article details

		const articleDetails = await Promise.all(
			articlesId.map(async (articleId) => {
				const details = await this.getArticleById(articleId.toString());
				return details;
			})
		);

		return articleDetails;
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
							$unwind: { path: "$imagePath", preserveNullAndEmptyArrays: true },
						},
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
			{
				$lookup: {
					from: "tags",
					localField: "tag",
					foreignField: "_id",
					as: "tag",
				},
			},
			{ $unwind: "$tag" },
			{
				$lookup: {
					from: "comments",
					localField: "_id",
					foreignField: "articleId",
					as: "comments",
					pipeline: [
						{
							$lookup: {
								from: "users",
								localField: "userId",
								foreignField: "_id",
								as: "user",
								pipeline: [
									{
										$unwind: {
											path: "$imagePath",
											preserveNullAndEmptyArrays: true,
										},
									},
									{ $project: { _id: 1, username: 1, imagePath: 1 } },
								],
							},
						},
						{ $unwind: "$user" },
					],
				},
			},
			{ $unwind: "$user" },
		]);
		return res[0];
	}

	async getArticlesByTagId(tagId: string) {
		return await this.article.find({ categoryId: { $in: [tagId] } });
	}

	async likeArticle(articleId: string, userId: string) {
		const article = await this.article.findById(articleId);
		if (!article) {
			throw new Error("Article not found");
		}
		return await this.article.findByIdAndUpdate(articleId, {
			$addToSet: { likes: userId },
		});
	}

	async unlikeArticle(articleId: string, userId: string) {
		const article = await this.article.findById(articleId);
		if (!article) {
			throw new Error("Article not found");
		}
		return await this.article.findByIdAndUpdate(articleId, {
			$pull: { likes: userId },
		});
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
