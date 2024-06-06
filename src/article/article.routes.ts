import express from "express";
import articleController from "./article.controller";
import authMiddleware from "../middleware/auth.middleware";
import { bodyValidator } from "../middleware/zod.validator";
import articleDTO from "./dto/article.dto";
import fileUpload from "../utils/multer";

const router = express.Router();

router.get("/", articleController.getAllArticles);
router.get("/:id", articleController.getArticleById);
router.get("/tag/:tagId", articleController.getArticlesByTagId);

router.put(
	"/:id",
	authMiddleware.checkAuthenticated,
	fileUpload,
	bodyValidator(articleDTO),
	articleController.updateArticle
);
router.delete(
	"/:id",
	authMiddleware.checkAuthenticated,
	articleController.deleteArticle
);

router.post(
	"/:id/like",
	authMiddleware.checkAuthenticated,
	articleController.likeArticle
);
router.delete(
	"/:id/like",
	authMiddleware.checkAuthenticated,
	articleController.unlikeArticle
);

router.post(
	"/",
	authMiddleware.checkAuthenticated,
	fileUpload,
	bodyValidator(articleDTO),
	articleController.createArticle
);

module.exports = router;
