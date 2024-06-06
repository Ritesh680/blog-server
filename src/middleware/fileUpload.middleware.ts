import { NextFunction, Request, Response } from "express";
import { uploadFileToS3 } from "../utils/uploadFile";
import { fileToBuffer } from "../utils/functions";

const { v4: uuid } = require("uuid");

class FileUploadMiddleware {
	async uploadFile(req: Request, res: Response, next: NextFunction) {
		const files = req.files;
		if (files) {
			if (Array.isArray(files)) {
				const uniqueId = uuid();
				files.forEach(async (file) => {
					await uploadFileToS3({
						Key: `${uniqueId}-${file.originalname}`,
						Body: Buffer.from(fileToBuffer(file.path) ?? ""),
					});
				});
			}
		}
		next();
	}
}
const fileUploadMiddleware = new FileUploadMiddleware();
export default fileUploadMiddleware;
