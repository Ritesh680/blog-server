import express from "express";
import authMiddleware from "./middleware/auth.middleware";
const router = express.Router();
import { getFileFroms3 } from "./utils/uploadFile";

router.get("/", authMiddleware.checkAuthenticated, (req, res) => {
	res.send("hello");
});

router.use("/auth", require("./auth/auth.routes"));
router.use("/article", require("./article/article.routes"));
router.use("/categories", require("./category/category.routes"));
router.use("/comments", require("./comment/comment.routes"));
router.use("/users", require("./users/user.routes"));
router.use("/tags", require("./tags/tags.route"));

router.get("/files/:path", async (req, res) => {
	try {
		const { headResponse, stream } = await getFileFroms3(req.params.path);
		res.set({
			"Content-Length": headResponse.ContentLength,
			"Content-Type": "image/jpeg",
			"Cache-Control": "max-age=604800",
			ETag: headResponse.ETag,
		});

		stream.on("data", (chunk) => res.write(chunk));
		stream.once("end", () => {
			res.end();
		});
		stream.once("error", () => {
			res.end();
		});
	} catch (err) {
		console.error(err);
		res.status(500).send("Error retrieving file");
	}
});

module.exports = router;
