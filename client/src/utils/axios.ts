import axios, { AxiosError, AxiosRequestConfig, Method } from "axios";
import { createError, objectToFormData } from "./function";
const instance = axios.create({
	baseURL: import.meta.env.VITE_API_URL,
	timeout: 5000,
	headers: {
		"Content-Type": "application/json",
	},
});
const token = localStorage.getItem("token");

instance.interceptors.request.use((config) => {
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
		if (config.headers["Content-Type"] === "multipart/form-data") {
			config.data = objectToFormData(config.data);
		}
		return config;
	}
	return config;
});

const getApiConfig = async (config?: AxiosRequestConfig) => {
	return {
		...config,
		headers: { ...config?.headers, Authorization: `Bearer ${token}` },
	};
};

async function axiosInstance<T>(
	method: Method,
	url: string,
	data?: unknown,
	config?: AxiosRequestConfig
): Promise<T | Error> {
	const apiConfig = await getApiConfig(config);
	let res;

	try {
		res = await instance.request({
			method,
			url,
			data,
			...apiConfig,
		});
		return res?.data;
	} catch (error) {
		let errorMessage = "Something went wrong";
		if (error instanceof AxiosError) {
			errorMessage =
				error.response?.data.message || error.message || "Something went wrong";
			createError(errorMessage);
		}
		throw new Error(errorMessage);
	}
}

export default axiosInstance;
