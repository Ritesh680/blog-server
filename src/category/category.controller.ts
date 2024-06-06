import { NextFunction, Request, Response } from "express";
import ApiResponse from "../middleware/response";
import { categoryService } from "./category.service";

class CategoryController {
	async createCategory(req: Request, res: Response, next: NextFunction) {
		const { name } = req.body;
		const alreadyExists = await categoryService.findCategoryByName(name);
		if (alreadyExists) {
			new ApiResponse(res).failed("CaTEGORY EXISTS", 400);
		}
		const result = await categoryService.createCategory(name);
		if (result) {
			new ApiResponse(res).success(
				result,
				"category created successfully",
				201
			);
		} else {
		}
	}

	async getAllCategories(req: Request, res: Response, next: NextFunction) {
		const result = await categoryService.getAllCategories();
		new ApiResponse(res).success(result, "All Categories");
	}

	async getCategoryById(req: Request, res: Response, next: NextFunction) {
		const id = req.params.id;
		const result = await categoryService.getArticlesByCategoryId(id);
		if (!result) {
			new ApiResponse(res).failed("category not found");
		}
		new ApiResponse(res).success(result, "category found");
	}

	async updateCategory(req: Request, res: Response, next: NextFunction) {
		const id = req.params.id;
		const { name } = req.body;
		const categoryExists = await categoryService.findCategoryById(id);
		if (!categoryExists) {
			new ApiResponse(res).failed("category not found");
		}

		const updatedResult = categoryService.findCategoryByIdAndUpdate(id, name);

		new ApiResponse(res).success(updatedResult, "data updated", 201);
	}
}
const categoryController = new CategoryController();

export default categoryController;
