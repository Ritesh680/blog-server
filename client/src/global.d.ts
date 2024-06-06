export {};
declare global {
	interface ApiResponse<T> {
		success: boolean;
		data: T;
		message: string;
	}

	interface UserList {
		_id: string;
		username: string;
		email: string;
		imagePath: string;
		description: string;
		tagsFollowing: string[];
		followers: UserList[];
		following: UserList[];
		articles: ArticleList[];
	}

	interface ArticleList {
		_id: string;
		title: string;
		description: string;
		content: string;
		user: UserList;
		likes: string[];
		comments: string[];
		publicationDate: Date;
		tag: TagList;
		filesPath: string[];
	}

	interface TagList {
		_id: string;
		name: string;
	}

	interface IUpdateUser {
		username: string;
		description: string;
		files: File;
	}

	interface ICreateArticle {
		title: string;
		description: string;
		content: string;
		files: File;
		categoryId: string;
	}
	interface ICreateArticleResponse extends ICreateArticle {
		_id: string;
	}

	interface ITagsWithArticles extends TagList {
		articles: ArticleList[];
		tagsFollowing: string[];
		followers: UserList[];
	}

	interface ICreateComment {
		comment: string;
		articleId: string;
	}

	interface IComment {
		_id: string;
		user: UserList;
		articleId: string;
		commentDate: Date;
		comment: string;
	}
}
