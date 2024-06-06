import express from "express";
import userController from "./user.controller";
import authMiddleware from "../middleware/auth.middleware";
import fileUpload from "../utils/multer";

const router = express.Router();

router.get("/", userController.getAllUsers);
router.get("/:id", userController.getUserDetailById);

router.put("/:id", fileUpload, userController.updateUser);

router.get("/:id/followers", userController.getUserFollowers);
router.get("/:id/following", userController.getUserFollowing);

router.get(
	"/me",
	authMiddleware.checkAuthenticated,
	userController.getUserDetails
);

router.post(
	"/:id/follow",
	authMiddleware.checkAuthenticated,
	userController.followUser
);
router.delete(
	"/:id/unfollow",
	authMiddleware.checkAuthenticated,
	userController.unfollowUser
);

module.exports = router;
