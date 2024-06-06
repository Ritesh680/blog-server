import { Response } from "express";

class ApiResponse {
	constructor(private res: Response) {}
	success(data: any, message?: string, statusCode = 200) {
		this.res.send({ success: true, data, message, statusCode });
	}

	failed(message: string, statusCode = 400) {
		this.res.status(statusCode).send({ success: false, message });
	}
}

export default ApiResponse;
