import mongoose, { Schema } from "mongoose";
import Tag from "../tags/tags.model";

const ArticleSchema = new Schema({
	title: String,
	description: String,
	content: String,
	filesPath: [{ type: String, default: "" }],
	tag: {
		type: mongoose.Types.ObjectId,
		ref: "Tag",
	},
	likes: [
		{
			type: mongoose.Types.ObjectId,
			ref: "User",
		},
	],
	comments: [
		{
			type: mongoose.Types.ObjectId,
			ref: "Comment",
		},
	],
	authorId: {
		type: Schema.Types.ObjectId,
		ref: "User",
	},
	categoryId: {
		type: Schema.Types.ObjectId,
		ref: "Category",
	},
	publicationDate: {
		type: Date,
		default: Date.now(),
	},
	viewsCount: { type: Number, default: 0 },
});
interface IUser extends Document {
	name: string;
	email: string;
	tag?: mongoose.Types.ObjectId;
}

ArticleSchema.pre<IUser>("save", async function (next) {
	if (!this.tag) {
		let defaultTag = await Tag.findOne({ name: "popular" });
		if (!defaultTag) {
			defaultTag = new Tag({ name: "popular" });
			await defaultTag.save();
		}
		this.tag = defaultTag._id as mongoose.Types.ObjectId;
	}
	next();
});
const Article = mongoose.model("Article", ArticleSchema);

export default Article;
