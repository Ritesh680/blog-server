import { Request } from "express";

export {};
declare global {
	interface RequestWithUser extends Request {
		user: any;
	}
	interface ITags {
		name: string;
		_id: string;
		followers: { _id: string }[];
	}

	interface ITagsWithArticles {
		articles: IArticle[];
		tagsFollowing: string[];
		tag: ITags;
	}
}
