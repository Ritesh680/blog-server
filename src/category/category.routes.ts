import express from "express";
import { bodyValidator } from "../middleware/zod.validator";
import categoryDTO from "./dto/category";
import categoryController from "./category.controller";
const router = express.Router();

router.post("/", bodyValidator(categoryDTO), categoryController.createCategory);
router.get("/", categoryController.getAllCategories);
router.get("/:id", categoryController.getCategoryById);
router.put("/:id", categoryController.updateCategory);

module.exports = router;
