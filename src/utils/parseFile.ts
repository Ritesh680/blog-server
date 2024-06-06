import { Request } from "express";
import { uploadFileToS3 } from "./uploadFile";

interface ParsedForm {
	fields: Record<string, string>;
	filesPath: Record<string, Buffer>;
}
export function parseForm(req: Request) {
	return new Promise<ParsedForm>((resolve, reject) => {
		const body = req.body;
		const files = req.files;

		const filePath: string[] = [];

		if (files && Array.isArray(files)) {
			files.forEach(async (file) => {
				const uploadFile = await uploadFileToS3({
					Key: file.originalname,
					Body: Buffer.from(file.path),
				});
				filePath.push(uploadFile.Key);
			});
		}
	});
}
