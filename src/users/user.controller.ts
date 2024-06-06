import { Request, Response } from "express";
import userService from "./user.service";
import ApiResponse from "../middleware/response";
import { decodeToken } from "../utils/functions";
import articleService from "../article/article.service";
import { uploadFileToS3 } from "../utils/uploadFile";

class UserController {
	async getAllUsers(req: Request, res: Response) {
		const data = await userService.getUsers();
		new ApiResponse(res).success(data, "Users fetched successfully");
	}
	async getUserDetails(req: Request, res: Response) {
		const token = req.headers.authorization?.split(" ")[1]!;
		const userId = (await decodeToken(token)).userId;
		const data = await userService.getUserDetails(userId);
		new ApiResponse(res).success(data, "User details fetched successfully");
	}

	async getUserDetailById(req: Request, res: Response) {
		const userId = req.params.id;
		const userDetails = await userService.getUserDetails(userId);
		const followers = await userService.getUserFollowers(userId);
		const following = await userService.getUserFollowing(userId);
		const articles = await articleService.getArticlesByUserId(userId);
		userDetails.followers = followers;
		userDetails.following = following;
		userDetails.articles = articles;
		new ApiResponse(res).success(
			userDetails,
			"User details fetched successfully"
		);
	}

	async followUser(req: Request, res: Response) {
		const token = req.headers.authorization?.split(" ")[1]!;
		const currentUserId = (await decodeToken(token)).userId;

		const followUserId = req.params.id;
		await userService.followUser(currentUserId, followUserId);

		await userService.addUserFollowing(currentUserId, followUserId);
		new ApiResponse(res).success(null, "User followed successfully");
	}

	async unfollowUser(req: Request, res: Response) {
		const token = req.headers.authorization?.split(" ")[1]!;
		const currentUserId = (await decodeToken(token)).userId;

		const followUserId = req.params.id;
		await userService.unfollowUser(currentUserId, followUserId);

		await userService.removeUserFollowing(currentUserId, followUserId);
		new ApiResponse(res).success(null, "User unfollowed successfully");
	}

	async getUserFollowers(req: Request, res: Response) {
		const userId = req.params.id;
		const data = await userService.getUserFollowers(userId);
		new ApiResponse(res).success(data, "User followers fetched successfully");
	}

	async getUserFollowing(req: Request, res: Response) {
		const userId = req.params.id;
		if (!userId) new ApiResponse(res).failed("User id is required", 400);
		const data = await userService.getUserFollowing(userId);
		new ApiResponse(res).success(data, "User following fetched successfully");
	}

	async updateUser(req: Request, res: Response) {
		const userId = req.params.id;
		const data = req.body;
		const files = req.files as Express.Multer.File[];

		try {
			if (files) {
				const uploadPromises = files.map(async (file) => {
					const fileKey = Date.now() + "-" + file.originalname;
					await uploadFileToS3({
						file: file,
						key: fileKey,
					});
					return fileKey;
				});
				const uploadedFiles = await Promise.all(uploadPromises);
				data.imagePath = uploadedFiles;
				const updatedUser = await userService.updateUser(userId, data);

				new ApiResponse(res).success(updatedUser, "User updated successfully");
			}
		} catch (error) {
			console.error(error);
		}
	}
}

const userController = new UserController();
export default userController;
