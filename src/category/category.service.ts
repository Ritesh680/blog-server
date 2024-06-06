import mongoose from "mongoose";
import Category from "./category.model";

class CategoryService {
	category = Category;

	async createCategory(name: string) {
		const alreadyExists = await this.findCategoryByName(name);

		if (alreadyExists) {
			return;
		}

		const res = await this.category.create({ name });

		return res;
	}

	async findCategoryByName(name: string) {
		const category = this.category.findOne({ name });
		return category;
	}
	async findCategoryById(id: string) {
		const category = this.category.findById({ _id: id });
		return category;
	}

	async getArticlesByCategoryId(categoryId: string) {
		const articles = this.category.aggregate([
			{
				$match: { _id: new mongoose.Types.ObjectId(categoryId) },
			},
			{
				$lookup: {
					from: "articles",
					localField: "_id",
					foreignField: "categoryId",
					as: "articles",
					pipeline: [
						{
							$lookup: {
								from: "users",
								localField: "authorId",
								foreignField: "_id",
								as: "user",
							},
						},
					],
				},
			},
		]);
		return articles;
	}

	async findCategoryByIdAndUpdate(id: string, name: string) {
		const category = this.category.findByIdAndUpdate(id, { name });
		console.log({ category });
		return category;
	}

	async getAllCategories() {
		return await this.category.find();
	}
}

export const categoryService = new CategoryService();
