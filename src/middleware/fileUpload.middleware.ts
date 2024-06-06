// import { Request, Response, NextFunction } from "express";

// interface IUploadMiddleware {
// 	uploadToS3(req: Request, res: Response, next: NextFunction): void;
// }

// class UploadMiddleware implements IUploadMiddleware {
// 	#aws: IAwsService ;

// 	constructor(aws: IAwsService) {
// 		this.#aws = aws;
// 	}

// 	uploadToS3 = async (req: Request, _res: Response, next: NextFunction) => {
// 		try {
// 			// Handle single file upload
// 			if (req.file) {
// 				//typecasting
// 				const fileWithKey = req.file as Express.Multer.File & { key: string };
// 				const key = `${Date.now().toString()}-name-${req.file.originalname}`;
// 				//
// 				fileWithKey.key = key;
// 				await this.#aws.uploadFile(req.file, key);
// 				// Handle multiple files or fields upload
// 			} else if (req.files) {
// 				if (Array.isArray(req.files)) {
// 					// Handle multiple files
// 					await Promise.all(
// 						req.files.map(async (file) => {
// 							const fileWithKey = file as Express.Multer.File & { key: string };
// 							const key = `${Date.now().toString()}-name-${file.originalname}`;
// 							//
// 							fileWithKey.key = key;
// 							await this.#aws.uploadFile(file, key);
// 						})
// 					);
// 				} else {
// 					// Handle fields upload (multiple files from different fields)
// 					const filesArray = Object.values(req.files).flat();
// 					await Promise.all(
// 						filesArray.map(async (file) => {
// 							const fileWithKey = file as Express.Multer.File & { key: string };
// 							const key = `${Date.now().toString()}-name-${file.originalname}`;
// 							//
// 							fileWithKey.key = key;
// 							await this.#aws.uploadFile(file, key);
// 						})
// 					);
// 				}
// 			}

// 			next();
// 		} catch (err) {
// 			next(err);
// 		}
// 	};
// }

// export default UploadMiddleware;
