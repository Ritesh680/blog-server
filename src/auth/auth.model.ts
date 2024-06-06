import mongoose, { CallbackError, Document, Schema } from "mongoose";
import bcrypt from "bcrypt";

export interface UserDocument extends Document {
	username: string;
	password: string;
	email: string;
	followers: mongoose.Types.ObjectId[];
	following: mongoose.Types.ObjectId[];
	registration_date: Date;
	imagePath: string;
	tagsFollowing: mongoose.Types.ObjectId[];
}

const userSchema = new Schema<UserDocument>({
	username: String,
	email: String,
	password: String,
	followers: [{ type: Schema.Types.ObjectId, ref: "User", default: [] }],
	following: [{ type: Schema.Types.ObjectId, ref: "User", default: [] }],
	registration_date: { type: Date, default: Date.now() },
	imagePath: [{ type: String, default: "" }],
	tagsFollowing: [{ type: Schema.Types.ObjectId, ref: "Tag", default: [] }],
});

userSchema.pre<UserDocument>("save", async function (next) {
	try {
		if (!this?.isModified("password")) {
			return next();
		}

		const salt = await bcrypt.genSalt(10);
		const hashed = await bcrypt.hash(this?.password, salt);
		this.password = hashed;
		next();
	} catch (error) {
		next(error as CallbackError);
	}
});

const User = mongoose.model("User", userSchema);
export default User;
