import mongoose from "mongoose";
import User from "../auth/auth.model";

class UserService {
	user = User;

	getUsers() {
		return this.user.aggregate([
			{ $unwind: "$imagePath" },
			{
				$project: {
					_id: 1,
					username: 1,
					email: 1,
					imagePath: 1,
				},
			},
		]);
	}

	async getUserDetails(id: string) {
		const result = await this.user.aggregate([
			{
				$match: {
					_id: new mongoose.Types.ObjectId(id),
				},
			},
			{
				$lookup: {
					from: "users",
					localField: "followers",
					foreignField: "_id",
					as: "followers",
					pipeline: [
						{
							$project: {
								username: 1,
								email: 1,
							},
						},
					],
				},
			},
			{
				$project: {
					username: 1,
					email: 1,
					registration_date: {
						$dateToString: { format: "%Y-%m-%d", date: "$registration_date" },
					},
					articles: 1,
					followers: 1,
					following: 1,
					imagePath: 1,
					description: 1,
					tagsFollowing: 1,
				},
			},
		]);
		return result[0];
	}

	async followUser(currentUserId: string, followUserId: string) {
		const res = await this.user.findByIdAndUpdate(
			followUserId,
			{ $push: { followers: currentUserId } },
			{ new: true }
		);
		return res;
	}

	async unfollowUser(currentUserId: string, followUserId: string) {
		const res = await this.user.findByIdAndUpdate(
			followUserId,
			{ $pull: { followers: currentUserId } },
			{ new: true }
		);
		return res;
	}

	async getUserFollowers(userId: string) {
		const followers = await this.user.aggregate([
			{ $match: { _id: new mongoose.Types.ObjectId(userId) } },
			{
				$lookup: {
					from: "users",
					localField: "followers",
					foreignField: "_id",
					as: "followers",
					pipeline: [
						{
							$project: {
								username: 1,
								email: 1,
							},
						},
					],
				},
			},
		]);
		return followers.map((user) => user.followers).flat();
	}
	async getUserFollowing(userId: string) {
		const following = await this.user.aggregate([
			{ $match: { _id: new mongoose.Types.ObjectId(userId) } },
			{
				$lookup: {
					from: "users",
					localField: "following",
					foreignField: "_id",
					as: "following",
					pipeline: [
						{
							$project: {
								username: 1,
								email: 1,
							},
						},
					],
				},
			},
		]);
		return following.map((user) => user.following).flat();
	}

	async updateUser(userId: string, data: Record<string, string>) {
		const updatedUser = await this.user.findByIdAndUpdate(userId, data, {
			new: true,
		});
		return updatedUser;
	}

	async addUserFollowing(currentUserId: string, followUserId: string) {
		const res = await this.user.findByIdAndUpdate(
			currentUserId,
			{ $addToSet: { following: followUserId } },
			{ new: true }
		);
		return res;
	}
	async removeUserFollowing(currentUserId: string, followUserId: string) {
		const res = await this.user.findByIdAndUpdate(
			currentUserId,
			{ $pull: { following: followUserId } },
			{ new: true }
		);
		return res;
	}
}

const userService = new UserService();
export default userService;
