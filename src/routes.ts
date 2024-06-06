import express from "express";
import authMiddleware from "./middleware/auth.middleware";
const router = express.Router();

router.get("/", authMiddleware.checkAuthenticated, (req, res) => {
	res.send("hello");
});

router.use("/auth", require("./auth/auth.routes"));
router.use("/article", require("./article/article.routes"));
router.use("/categories", require("./category/category.routes"));
router.use("/comments", require("./comment/comment.routes"));
router.use("/users", require("./users/user.routes"));
router.use("/tags", require("./tags/tags.route"));

router.get("/uploads/:path", (req, res) => {
	res.sendFile(req.params.path, { root: "uploads" });
});

module.exports = router;
