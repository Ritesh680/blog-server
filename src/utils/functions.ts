import jwt from "jsonwebtoken";
import fs from "fs";

interface IDecodedToken {
	email: string;
	userId: string;
}

export function getToken(token?: string) {
	if (!token) {
		console.error("No token found");
		return null;
	}
	return token.startsWith("Bearer ") ? token.split(" ")[1] : token;
}

export async function decodeToken(token: string) {
	const decoded = jwt.decode(token);
	return decoded as IDecodedToken;
}

export async function getUserIdFromToken(authHeader?: string) {
	const token = getToken(authHeader);
	if (!token) return null;
	const decoded = await decodeToken(token);
	return decoded.userId;
}

export function fileToBuffer(filePath: string) {
	try {
		const fileData = fs.readFileSync(filePath);
		return fileData;
	} catch (error) {
		console.error("Error reading file:", error);
		return Buffer.from("");
	}
}
