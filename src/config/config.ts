import * as dotenv from "dotenv";

export default (_env: any) => {
	dotenv.config();

	const envVars = {
		database_URI: process.env.MONGO_URL,
		port: process.env.PORT,
		jwtToken: process.env.JWT_TOKEN || "",
		awsBucketName: process.env.AWS_BUCKET_NAME,
		awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
		awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
		awsRegion: process.env.AWS_REGION,
	};
	return envVars;
};
