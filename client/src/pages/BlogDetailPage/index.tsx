import { useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "react-query";
import MarkdownEditor from "@uiw/react-markdown-editor";

import { Separator } from "@/components/Separator";
import articleService from "@/service/article.service";
import { formatDate } from "@/utils/utils";
import InfiniteProgressBar from "@/components/InfiniteProgressBar";
import { Badge } from "@/Badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/Avatar";
import { UserContext } from "@/context/user.context";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/DropdownMenu";
import {
	EllipsisOutlined,
	HeartFilled,
	HeartOutlined,
	ShareAltOutlined,
} from "@ant-design/icons";
import { QueryKeys } from "@/constants/QueryKeys";
import userService from "@/service/user.service";
import Comment from "@/components/Comments";
import BlogDetailSkeleton from "@/components/BlogDetailsSkeleton";
import { Button } from "@/components/Button";

const BlogDetailPage = () => {
	useEffect(() => {
		window.scrollTo(0, 0); // Scroll to the top when component mounts
	}, []);

	const { blogId } = useParams();
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	const { authenticated: isAuthenticated, userProfile } =
		useContext(UserContext);

	// fetching the blog details
	const { data, isLoading } = useQuery({
		queryKey: [QueryKeys.Blogs, blogId],
		queryFn: () => articleService.getArticleById(blogId!),
		enabled: !!blogId,
	});

	// fetching the following of the author
	const following = useQuery({
		queryKey: [QueryKeys.Following, userProfile?._id],
		queryFn: () => userService.getUserFollowingById(userProfile?._id || ""),
		enabled: !!userProfile?._id,
	});

	// handle blog Edit function
	const handleEdit = () => {
		navigate(`/edit-blog/${data?._id}`);
	};

	//mutation query for blog deletion
	const deleteBlog = useMutation({
		mutationFn: () => articleService.deleteArticle(blogId!),
		onSuccess: () => {
			queryClient.removeQueries({
				queryKey: [QueryKeys.Blogs, blogId],
				exact: true,
			});

			navigate("/");
		},
	});

	// mutation query for liking a blog
	const likeBlog = useMutation({
		mutationFn: () => articleService.likeArticle(blogId!),

		onMutate: async () => {
			// Optimistically update the local cache
			queryClient.setQueryData<ArticleList | undefined>(
				[QueryKeys.Blogs, blogId],
				(prev) => {
					if (prev) {
						return {
							...prev,

							// Simulate adding a like optimistically
							likes: [...prev.likes, userProfile?._id || ""],
						};
					}
					return prev;
				}
			);
		},

		onSettled: () => {
			queryClient.refetchQueries({
				queryKey: [QueryKeys.Blogs, blogId],
			});
		},
	});

	// mutation query for unliking a blog
	const unLikeBlog = useMutation({
		mutationFn: () => articleService.unlikeArticle(blogId!),

		onMutate: () => {
			queryClient.setQueryData<ArticleList | undefined>(
				[QueryKeys.Blogs, blogId],
				(prev) => {
					if (prev) {
						return {
							...prev,
							likes: prev.likes.filter((likeId) => likeId !== userProfile?._id),
						};
					}
					return prev;
				}
			);
		},

		onSettled: () => {
			queryClient.refetchQueries({
				queryKey: [QueryKeys.Blogs, blogId],
			});
		},
	});

	// mutation function to follow
	const followUser = useMutation({
		mutationFn: () => userService.followUser(data?.user._id || ""),

		onMutate: () => {
			// Optimistically update the local cache
			queryClient.setQueryData<UserList | undefined>(
				[QueryKeys.Following, userProfile?._id],
				(prev) => {
					if (prev) {
						return {
							...prev,
							following: [
								...prev.following,
								{ _id: data?.user?._id } as UserList,
							],
						};
					}
					return prev;
				}
			);
		},
		onSettled: () => {
			queryClient.refetchQueries({
				queryKey: ["blogs", blogId],
			});
		},
	});

	// mutation function to unfollow
	const unFollowUser = useMutation({
		mutationFn: () => userService.unfollowUser(data?.user._id || ""),

		onMutate: () => {
			// Optimistically update the local cache
			queryClient.setQueryData<UserList | undefined>(
				[QueryKeys.Following, userProfile?._id],
				(prev) => {
					if (prev) {
						return {
							...prev,
							following: prev.following.filter(
								(author) => author._id !== data?.user?._id
							),
						};
					}
					return prev;
				}
			);
		},
		onSettled: () => {
			queryClient.refetchQueries({
				queryKey: ["blogs", blogId],
			});
		},
	});

	// handle blog delete function
	const handleDelete = () => {
		deleteBlog.mutate();
	};

	// handle like
	const handleLike = () => {
		if (isAuthenticated) likeBlog.mutate();
	};

	// handle unlike
	const handleUnlike = () => {
		if (isAuthenticated) unLikeBlog.mutate();
	};

	// // handle follow user
	const handleFollow = () => {
		if (isAuthenticated) followUser.mutate();
	};

	// handle unfollow user
	const handleUnfollow = () => {
		if (isAuthenticated) unFollowUser.mutate();
	};

	if (isLoading)
		return (
			<div>
				<BlogDetailSkeleton />
			</div>
		);

	const copyURLToClipboard = () => {
		const urlToCopy = window.location.href;

		// Using the Clipboard API to copy the URL
		navigator.clipboard.writeText(urlToCopy);
	};

	const date = formatDate(data?.publicationDate || new Date());

	if (isLoading || !data)
		return (
			<div>
				<BlogDetailSkeleton />
			</div>
		);

	return (
		<>
			{deleteBlog.isLoading && <InfiniteProgressBar />}
			<div className="z-10 flex justify-center pt-10 pb-10 mx-5 bg-background lg:px-0">
				<div className="w-[1000px] overflow-hidden  p-5">
					{data?.tag && (
						<div>
							<Badge tagId={data.tag?._id} className="mb-5">
								{data.tag?.name}
							</Badge>
						</div>
					)}

					{/* blog title */}
					<div className="mb-5 text-5xl font-semibold">{data?.title}</div>

					{/* blog description */}
					<div className="mb-5 text-xl text-muted-foreground">
						{data?.description}
					</div>

					{/* avatar */}
					<div className="flex flex-wrap items-center justify-between">
						<div className="flex mb-5 space-x-4">
							<Avatar>
								<AvatarImage
									src={`${import.meta.env.VITE_FILE_URL}/${
										data?.user?.imagePath
									}`}></AvatarImage>
								<AvatarFallback>
									{data.user?.username?.slice(0, 2)}
								</AvatarFallback>
							</Avatar>
							<div className="flex flex-col space-y-0.5">
								<div className="flex gap-5 ">
									<Link
										to={`/users/${data.user?._id}`}
										className="text-sm font-semibold">
										{data.user?.username}
									</Link>

									{/* follow and unfollow link */}
									{isAuthenticated && data?.user?._id !== userProfile?._id && (
										<div className="text-sm font-semibold text-green-600 cursor-pointer hover:underline">
											{following?.data?.some(
												(following) => following._id == data?.user._id
											) ? (
												<Button onClick={handleUnfollow}>Following</Button>
											) : (
												<Button onClick={handleFollow}>Follow</Button>
											)}
										</div>
									)}
								</div>

								<span className="text-xs text-muted-foreground">{date}</span>
							</div>
						</div>

						{/* conditonally rendering the edit and delete menu icon */}
						{data?.user?._id === userProfile?._id && (
							<div>
								<DropdownMenu>
									<DropdownMenuTrigger>
										<EllipsisOutlined />
									</DropdownMenuTrigger>
									<DropdownMenuContent>
										<DropdownMenuItem
											onClick={() => {
												handleEdit();
											}}>
											Edit
										</DropdownMenuItem>
										<DropdownMenuItem onClick={handleDelete}>
											Delete
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</div>
						)}
					</div>

					<Separator />

					<div className="flex flex-wrap items-center justify-between">
						<div className="space-x-2">
							<button
								aria-label="Share this post"
								type="button"
								className="p-1 text-center hover:underline"
								onClick={copyURLToClipboard}>
								<ShareAltOutlined className="w-5 h-5" />
								Share
							</button>
						</div>

						{/* {/* thumbsup and comment */}
						{isAuthenticated ? (
							<div className="flex space-x-4 ">
								<button
									type="button"
									className="flex items-center p-1 space-x-1.5">
									{/* comment component */}
									<Comment />
									<span>{data.comments.length}</span>
								</button>

								{data.likes.some((like) => like === userProfile?._id) ? (
									<button
										type="button"
										className="flex items-center p-1 space-x-1.5"
										onClick={handleUnlike}>
										<HeartFilled className="text-red-500" />
										<span>{data.likes.length}</span>
									</button>
								) : (
									<button
										type="button"
										className="flex items-center p-1 space-x-1.5 "
										onClick={handleLike}>
										<HeartOutlined />
										<span>{data.likes.length}</span>
									</button>
								)}
							</div>
						) : (
							<div className="flex space-x-4 ">
								<button
									type="button"
									className="flex items-center p-1 space-x-1.5">
									{/* comment component */}
									<Comment />
									<span>{data.comments.length}</span>
								</button>

								{data.likes.some((like) => like === userProfile?._id) ? (
									<button
										type="button"
										className="flex items-center p-1 space-x-1.5"
										onClick={handleUnlike}>
										<HeartFilled style={{ color: "red" }} />
										<span>{data.likes.length}</span>
									</button>
								) : (
									<Link
										to="/login"
										type="button"
										className="flex items-center p-1 space-x-1.5 ">
										<HeartOutlined />
										<span>{data.likes.length}</span>
									</Link>
								)}
							</div>
						)}
					</div>
					<Separator className="mb-5" />
					<img
						src={`${import.meta.env.VITE_FILE_URL}/${data.filesPath?.[0]}`}
						onError={(e) => {
							e.currentTarget.onerror = null;
							e.currentTarget.src = "https://via.placeholder.com/150";
						}}
						alt="cover image"
						width={"400px"}
						height={"40px"}
						className="object-contain mb-5 rounded-lg aspect-square "
					/>

					<MarkdownEditor.Markdown
						source={data.content}
						className="bg-gray-200 text-black p-4"
					/>
				</div>
			</div>
		</>
	);
};

export default BlogDetailPage;
