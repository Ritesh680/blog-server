import axiosInstance from "@/utils/axios";

class UserService {
	async getAllUsers() {
		const res = await axiosInstance<ApiResponse<UserList[]>>("get", "/users");
		if (res instanceof Error) throw Error("Something went wrong");

		return res.data;
	}
	async getUserById(id: string) {
		const res = await axiosInstance<ApiResponse<UserList>>(
			"get",
			`/users/${id}`
		);
		if (res instanceof Error) throw Error("Something went wrong");
		return res.data;
	}
	async getUserFollowerById(id: string) {
		const res = await axiosInstance<ApiResponse<UserList[]>>(
			"get",
			`/users/${id}/followers`
		);
		if (res instanceof Error) throw Error("Something went wrong");
		return res.data;
	}
	async getUserFollowingById(id: string) {
		const res = await axiosInstance<ApiResponse<UserList[]>>(
			"get",
			`/users/${id}/following`
		);
		if (res instanceof Error) throw Error("Something went wrong");
		return res.data;
	}

	async updateUser(id: string, data: IUpdateUser) {
		const res = await axiosInstance<ApiResponse<UserList>>(
			"put",
			`/users/${id}`,
			data,
			{
				headers: {
					"Content-Type": "multipart/form-data",
				},
			}
		);
		if (res instanceof Error) throw Error("Something went wrong");
		return res.data;
	}

	async unfollowUser(id: string) {
		const res = await axiosInstance<ApiResponse<UserList>>(
			"delete",
			`/users/${id}/unfollow`
		);
		if (res instanceof Error) throw Error("Something went wrong");
		return res.data;
	}
	async followUser(id: string) {
		const res = await axiosInstance<ApiResponse<UserList>>(
			"POST",
			`/users/${id}/follow`
		);
		if (res instanceof Error) throw Error("Something went wrong");
		return res.data;
	}
}
const userService = new UserService();
export default userService;
