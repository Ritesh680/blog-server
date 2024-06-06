import multer from "multer";

const storage = multer.memoryStorage();
const fileUpload = multer({
	storage,
	limits: { fileSize: 1024 * 1024 * 5 },
}).array("files");

export default fileUpload;
