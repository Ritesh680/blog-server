import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
	articleId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Article",
		required: true,
	},
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	comment: {
		type: String,
		required: true,
	},
	commentDate: {
		type: Date,
		default: Date.now,
	},
});

const Comment = mongoose.model("Comment", commentSchema);
export default Comment;
