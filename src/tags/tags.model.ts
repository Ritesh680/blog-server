import mongoose, { Schema } from "mongoose";
import User from "../auth/auth.model";

interface TagDocument extends mongoose.Document {
	name: string;
	followers: mongoose.Types.ObjectId[];
}

const TagSchema = new Schema<TagDocument>({
	name: String,
	followers: [
		{
			type: Schema.Types.ObjectId,
			ref: "User",
			default: [],
		},
	],
});

// Post hook for findOneAndUpdate
TagSchema.post(
	"findOneAndUpdate",
	async function (this: any, doc: TagDocument) {
		try {
			console.log({ this: this._update });
			const shouldAdd = this._update.$addToSet;
			const query = shouldAdd
				? { $addToSet: { tagsFollowing: doc._id } }
				: { $pull: { tagsFollowing: doc._id } };
			// Update each user to remove the tag from their tagsFollowing array and add it if it doesn't exist
			const updateUser = await User.updateMany(
				{ _id: { $in: doc.followers } },
				query
			);

			console.log({ updateUser });

			console.log("Users updated successfully");
			return updateUser;
		} catch (error) {
			console.error("Error updating users:", error);
		}
	}
);

const Tag = mongoose.model("Tag", TagSchema);
export default Tag;
