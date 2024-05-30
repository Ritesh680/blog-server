import axiosInstance from "@/utils/axios";

class ArticleService {
	async getArticles() {
		const response = await axiosInstance<ApiResponse<IArticle[]>>(
			"get",
			"/article"
		);
		if (response instanceof Error) {
			throw new Error(response.message);
		}
		return response.data;
	}
	async getArticleById(id: string) {
		const response = await axiosInstance<ApiResponse<IArticle>>(
			"get",
			`/article/${id}`
		);
		if (response instanceof Error) {
			throw new Error(response.message);
		}
		return response.data;
	}

	async likeArticle(articleId: string) {
		const response = await axiosInstance<ApiResponse<IArticle>>(
			"post",
			`article/like/${articleId}`
		);
		if (response instanceof Error) {
			throw new Error(response.message);
		}
		return response.data;
	}

	async deleteArticle(articleId: string) {
		const response = await axiosInstance<ApiResponse<IArticle>>(
			"delete",
			`article/${articleId}`
		);
		if (response instanceof Error) {
			throw new Error(response.message);
		}
		return response.data;
	}
}

const articleService = new ArticleService();
export default articleService;
