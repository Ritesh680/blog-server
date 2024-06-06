import mongoose from "mongoose";
import Comment from "./comment.model";

interface ICreateComment {
	articleId: string;
	userId: string;
	comment: string;
}

class CommentService {
	comment = Comment;

	async createComment(body: ICreateComment) {
		const response = await this.comment.create(body);
		return response;
	}

	async getCommentById(id: string) {
		const response = await this.comment.findById(id);
		return response;
	}

	async getCommentByBlogId(id: string) {
		const response = await this.comment.aggregate([
			{ $match: { articleId: new mongoose.Types.ObjectId(id) } },
			{
				$lookup: {
					from: "users",
					localField: "userId",
					foreignField: "_id",
					as: "user",
					pipeline: [{ $project: { _id: 1, username: 1, imagePath: 1 } }],
				},
			},
			{ $unwind: "$user" },
		]);
		return response;
	}

	async getAllComment() {
		return await this.comment.find();
	}

	async deleteComment(id: string) {
		return await this.comment.findByIdAndDelete(id);
	}

	async updateComment(id: string, body: ICreateComment) {
		return await this.comment.findByIdAndUpdate(id, body);
	}
}

const commentService = new CommentService();
export default commentService;
