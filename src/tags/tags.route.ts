import express from "express";
import tagController from "./tags.controller";
const router = express.Router();

router.get("/", tagController.getAllTags);
router.get("/:id", tagController.getTagById);
router.post("/", tagController.createTag);
router.post("/:tagId/follower", tagController.addFollowers);
router.delete("/:tagId/follower", tagController.removeFollower);

module.exports = router;
