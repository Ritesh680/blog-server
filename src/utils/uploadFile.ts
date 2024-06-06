import AWS, { S3 } from "aws-sdk";
import Config from "../config/config";
import fs from "fs";

const config = Config(process.env.NODE_ENV);

const credentials = new AWS.EnvironmentCredentials("AWS");
AWS.config.credentials = credentials;

const s3 = new AWS.S3({
	accessKeyId: config.awsAccessKeyId,
	secretAccessKey: config.awsSecretAccessKey,
	region: config.awsRegion,
});

export function uploadFileToS3(params: {
	Key: string;
	Body: Buffer;
}): Promise<S3.ManagedUpload.SendData> {
	return new Promise((resolve, reject) => {
		const s3Params: S3.Types.PutObjectRequest = {
			Bucket: config.awsBucketName || "",
			Key: params.Key,
			Body: params.Body,
			Metadata: {
				timestamp: new Date().toISOString(),
			},
		};
		s3.upload(s3Params, (err, data) => {
			if (err) {
				reject(err);
			}

			const processingError = false;
			if (processingError) {
				const deleteParams: S3.Types.DeleteObjectRequest = {
					Bucket: s3Params.Bucket,
					Key: s3Params.Key,
				};

				s3.deleteObject(deleteParams, (err, data) => {
					if (err) {
						reject(err);
					} else {
						console.log("File deleted successfully", data);
					}
				});
				return reject(new Error("File processing error"));
			}
			resolve(data);
		});
	});
}

export function deleteFileFromS3(params: {
	Key: string;
}): Promise<S3.DeleteObjectOutput> {
	return new Promise((resolve, reject) => {
		const s3Params: S3.Types.DeleteObjectRequest = {
			Bucket: config.awsBucketName || "",
			Key: params.Key,
		};
		s3.deleteObject(s3Params, (err, data) => {
			if (err) {
				reject(err);
			}
			resolve(data);
		});
	});
}

export function getFileFromS3(params: {
	Key: string;
}): Promise<S3.GetObjectOutput> {
	return new Promise((resolve, reject) => {
		const s3Params: S3.Types.GetObjectRequest = {
			Bucket: config.awsBucketName || "",
			Key: params.Key,
		};
		s3.getObject(s3Params, (err, data) => {
			if (err) {
				reject(err);
			}
			resolve(data);
		});
	});
}

export function deleteFileLocally(filePath: string) {
	fs.unlink(filePath, (err) => {
		if (err) {
			console.error("Error deleting file", err);
		}
	});
}
