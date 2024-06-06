import {
	S3Client,
	HeadObjectCommandOutput,
	HeadObjectCommand,
	GetObjectCommand,
	PutObjectCommand,
	DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import Config from "../config/config";

import { Readable, PassThrough } from "stream";

const config = Config(process.env.NODE_ENV);

interface StreamFileResponse {
	headResponse: HeadObjectCommandOutput;
	stream: Readable;
}

const s3 = new S3Client({
	region: config.awsRegion || "",
	credentials: {
		accessKeyId: config.awsAccessKeyId || "",
		secretAccessKey: config.awsSecretAccessKey || "",
	},
});

export const uploadFileToS3 = async (params: {
	key: string;
	file: Express.Multer.File;
}) => {
	try {
		const fileStream = new PassThrough();
		fileStream.end(params.file.buffer);

		const uploadParams = {
			Bucket: config.awsBucketName || "",
			Key: params.key,
			Body: fileStream,
			ContentType: params.file.mimetype,
			ContentLength: params.file.size,
		};

		await s3.send(new PutObjectCommand(uploadParams));
	} catch (err) {
		const error = err as { message: string };
		throw new Error(error.message);
	}
};

export const deleteFileFromS3 = async (key: string) => {
	const params = {
		Bucket: config.awsBucketName,
		Key: key,
	};
	const data = await s3.send(new DeleteObjectCommand(params));
	return data;
};

export const getFileFroms3 = async (
	key: string
): Promise<StreamFileResponse> => {
	try {
		const params = {
			Bucket: config.awsBucketName,
			Key: key,
		};
		//
		const headResponse = await s3.send(new HeadObjectCommand(params));

		// Now get the object data and stream it
		const response = await s3.send(new GetObjectCommand(params));
		const stream = response.Body as Readable;

		if (!stream) {
			throw new Error("Content not found");
		}

		return { headResponse, stream };
	} catch (err) {
		const error = err as { message: string };
		throw new Error(error.message);
	}
};
