import { NextFunction, Request, Response } from "express";
import tagService from "./tag.service";
import ApiResponse from "../middleware/response";
import { getUserIdFromToken } from "../utils/functions";

class TagController {
	async createTag(req: Request, res: Response, next: NextFunction) {
		const { name } = req.body;
		// Check if tag exists
		const alreadyExists = await tagService.findTagByName(name);
		if (alreadyExists) {
			return new ApiResponse(res).failed("Tag already exists", 400);
		}
		// Create tag
		const result = await tagService.createTag(name);
		return new ApiResponse(res).success(
			result,
			"Tag created successfully",
			201
		);
	}

	async getAllTags(req: Request, res: Response, next: NextFunction) {
		// Get all tags
		const result = await tagService.getAllTags();
		return new ApiResponse(res).success(result, "All Tags");
	}

	async getTagById(req: Request, res: Response, next: NextFunction) {
		// Get a tag by ID
		const id = req.params.id;
		const result = await tagService.findTagById(id);
		if (!result) {
			return new ApiResponse(res).failed("Tag not found");
		}
		return new ApiResponse(res).success(result, "Tag found");
	}

	async addFollowers(req: Request, res: Response, next: NextFunction) {
		//get userId from token
		const userId = await getUserIdFromToken(req.headers.authorization);

		if (!userId) return new ApiResponse(res).failed("User not found", 404);
		// Add followers to a tag
		const tagId = req.params.tagId;
		if (!tagId) return new ApiResponse(res).failed("Tag not found", 404);
		const result = await tagService.addFollower(tagId, userId);
		return new ApiResponse(res).success(result, "Follower added successfully");
	}

	async removeFollower(req: Request, res: Response, next: NextFunction) {
		//get userId from token
		const userId = await getUserIdFromToken(req.headers.authorization);

		if (!userId) return new ApiResponse(res).failed("User not found", 404);

		// Remove a follower from a tag
		const tagId = req.params.tagId;
		if (!tagId) return new ApiResponse(res).failed("Tag not found", 404);
		const result = await tagService.removeFollower(tagId, userId);
		return new ApiResponse(res).success(
			result,
			"Follower removed successfully"
		);
	}
}
const tagController = new TagController();
export default tagController;
