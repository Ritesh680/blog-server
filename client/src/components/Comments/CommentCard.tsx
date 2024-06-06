import { QueryKeys } from "@/constants/QueryKeys";
import commentService from "@/service/comment.service";
import { useMutation, useQueryClient } from "react-query";
import InfiniteProgressBar from "../InfiniteProgressBar";
import { Avatar, AvatarFallback, AvatarImage } from "../Avatar";
import { Link } from "react-router-dom";
import { formatDate } from "@/utils/utils";
import { useContext, useState } from "react";
import { UserContext } from "@/context/user.context";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "../DropdownMenu";
import { EllipsisOutlined } from "@ant-design/icons";
import CommentEditInput from "./CommentEditInput";

const CommentCard = ({ data }: { data: IComment }) => {
	const queryClient = useQueryClient();
	const { userProfile } = useContext(UserContext);

	const [showEditInput, setShowEditInput] = useState(false);

	const date = formatDate(data.commentDate);

	const { mutate, isLoading } = useMutation({
		mutationFn: (commentId: string) => commentService.deleteComment(commentId),
		onSuccess: () => {
			queryClient.refetchQueries({
				queryKey: [QueryKeys.Comments, data.articleId],
			});
			queryClient.refetchQueries({
				queryKey: [QueryKeys.Article, data.articleId],
			});
		},
	});

	//   function to delete comment
	const handleDelete = (commentId: string) => {
		mutate(commentId);
	};

	// function to handle edit
	const handleEdit = () => {
		setShowEditInput(true);
	};

	return (
		<>
			{isLoading && <InfiniteProgressBar />}
			<div className="mb-5">
				<div className="flex flex-wrap items-center justify-between">
					<div className="flex mb-5 space-x-4">
						<Avatar>
							<AvatarImage
								src={`${import.meta.env.VITE_FILE_URL}/${
									data?.user?.imagePath
								}`}
								alt="@shadcn"
							/>
							<AvatarFallback>
								{data?.user?.username?.slice(0, 2)}
							</AvatarFallback>
						</Avatar>
						<div className="flex flex-col space-y-0.5">
							<Link
								to={`/users/${data?.user?._id}`}
								className="text-sm font-semibold">
								{data?.user?.username}
							</Link>
							<span className="text-xs text-muted-foreground">{date}</span>
						</div>
					</div>

					{/* conditonally rendering the edit and delete menu icon */}
					{userProfile?._id === data?.user?._id && (
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
									<DropdownMenuItem
										onClick={() => {
											handleDelete(data._id);
										}}>
										Delete
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					)}
				</div>
				{!showEditInput ? (
					<div className="text-sm">{data.comment}</div>
				) : (
					<CommentEditInput input={data} setShowEditInput={setShowEditInput} />
				)}
			</div>
		</>
	);
};

export default CommentCard;
