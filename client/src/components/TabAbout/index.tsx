// import EditUserDetails from "./EditUserDetails";

import { UserContext } from "@/context/user.context";
import userService from "@/service/user.service";
import { useContext } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useParams } from "react-router";
import UserProfileSkeleton from "../UserProfileSkeleton";
import { Avatar, AvatarFallback, AvatarImage } from "../Avatar";
import { QueryKeys } from "@/constants/QueryKeys";
import EditUserDetails from "../EditUserDetails";

const TabAbout = () => {
	const { userId: usersId } = useParams();

	const { authenticated: isAuthenticated, userProfile } =
		useContext(UserContext);

	// fetch basic user info
	const user = useQuery({
		queryKey: [QueryKeys.Users, usersId],
		queryFn: () => userService.getUserById(usersId!),
		enabled: !!usersId,
	});

	const queryClient = useQueryClient();

	// fetch user's followers
	const userFollowers = useQuery({
		queryKey: [QueryKeys.Followers, usersId],
		queryFn: () => userService.getUserFollowerById(usersId!),
		enabled: !!usersId,
	});

	// fetch user's following
	const userFollowing = useQuery({
		queryKey: [QueryKeys.Following, usersId],
		queryFn: () => userService.getUserFollowingById(usersId!),
		enabled: !!usersId,
	});

	// mutation function to unfollow
	const unFollowUser = useMutation({
		mutationFn: () => userService.unfollowUser(usersId!),

		onSettled: () => {
			queryClient.refetchQueries({
				queryKey: [QueryKeys.Followers, user?.data?._id],
			});
		},
	});

	// mutation function to follow
	const followUser = useMutation({
		mutationFn: () => userService.followUser(usersId!),
		onSettled: () => {
			queryClient.refetchQueries({
				queryKey: [QueryKeys.Followers, usersId],
			});
			queryClient.refetchQueries({
				queryKey: ["following", usersId],
			});
		},
	});

	// function to unfollow user
	const handleUnfollow = () => {
		if (isAuthenticated) unFollowUser.mutate();
	};

	// function to follow user
	const handleFollow = () => {
		if (isAuthenticated) followUser.mutate();
	};

	// loading
	if (user.isLoading || userFollowers.isLoading || userFollowing.isLoading)
		return <UserProfileSkeleton />;

	return (
		<div className="flex flex-col ">
			{/* avatar */}
			<div className="mb-5">
				<Avatar className="w-40 h-40">
					<AvatarImage
						src={`${import.meta.env.VITE_FILE_URL}/${user.data?.imagePath[0]}`}
						alt="@shadcn"
					/>
					<AvatarFallback className="text-7xl">
						{user.data?.username.slice(0, 2)}
					</AvatarFallback>
				</Avatar>
			</div>
			{/* name */}
			<div className="flex items-baseline gap-3">
				<div className="mb-3 text-3xl font-semibold">{user.data?.username}</div>

				{/* follow unfollow button */}
				{isAuthenticated && user.data?._id === userProfile?._id && (
					<EditUserDetails data={user.data} />
				)}

				{isAuthenticated &&
					user.data?._id !== userProfile?._id &&
					(userFollowers?.data?.some(
						(following) => following._id == userProfile?._id
					) ? (
						<div
							className="font-semibold text-green-600 cursor-pointer hover:underline"
							onClick={handleUnfollow}>
							Following
						</div>
					) : (
						<div
							className="font-semibold text-green-600 cursor-pointer hover:underline"
							onClick={handleFollow}>
							Follow
						</div>
					))}
			</div>

			{/* about */}
			{user?.data?.description && (
				<div className="text-muted-foreground">
					{user.data?.description || <></>}
				</div>
			)}

			{/* followers and following */}
			<div className="flex gap-5 font-semibold ">
				<div>
					<span className="mr-2">Followers</span>
					{userFollowers.data?.length ?? "0"}
				</div>
				<div>
					<span className="mr-2">Following</span>
					{userFollowing.data?.length ?? "0"}
				</div>
			</div>
		</div>
	);
};

export default TabAbout;
