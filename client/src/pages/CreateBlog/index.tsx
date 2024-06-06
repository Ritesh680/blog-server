import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "react-query";
import { useNavigate, useParams } from "react-router";
import AsyncCreatable from "@/components/AsyncCreatableTable";

import { Button } from "@/components/Button";
import InfiniteProgressBar from "@/components/InfiniteProgressBar";
import { Input } from "@/components/Input";
import { Label } from "@/components/Label";
import { QueryKeys } from "@/constants/QueryKeys";

import articleService from "@/service/article.service";
import tagService from "@/service/tags.service";
import Editor from "@/components/Editor";
import { useEffect, useState } from "react";
import { createFileFromUrl } from "../../utils/function";
import { Skeleton } from "@/components/Skeleton";
import InfiniteLoader from "@/components/InfiniteLoader";

const CreateorEdit_Blog = () => {
	const navigate = useNavigate();
	const { blogId } = useParams();

	const {
		register,
		handleSubmit,
		watch,
		setValue,
		control,
		formState: { errors },
		reset,
	} = useForm<ICreateArticle>();

	const [isFileDownloading, setIsFileDownloading] = useState(false);

	const { data } = useQuery({
		queryKey: [QueryKeys.Article, blogId],
		queryFn: () => articleService.getArticleById(blogId!),
		enabled: !!blogId,
	});

	// // mutation function to insert new blog
	const { mutate, isLoading: isPending } = useMutation({
		mutationFn: (newBlog: ICreateArticle) =>
			articleService.createArticle(newBlog),
		onSuccess: (res) => {
			navigate(`/blogs/${res._id}`);
		},
	});

	const updateBlog = useMutation({
		mutationFn: (newBlog: ICreateArticle) =>
			articleService.updateArticle(blogId!, newBlog),
		onSuccess: (res) => {
			navigate(`/blogs/${res._id}`);
		},
	});

	function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files![0];
		if (file) {
			setValue("files", file);
		}
	}

	function onSubmit(data: ICreateArticle) {
		if (blogId) return updateBlog.mutate(data);
		mutate(data);
	}

	useEffect(() => {
		if (data) {
			setIsFileDownloading(true);
			reset({
				title: data.title,
				description: data.description,
				categoryId: data.tag._id,
				content: data.content,
			});

			createFileFromUrl(
				`${import.meta.env.VITE_FILE_URL}/${data.filesPath[0]}`,
				"cover.jpg"
			).then((file) => {
				setValue("files", file);
				setIsFileDownloading(false);
			});
		}
	}, [data, reset, setValue]);
	return (
		<div className="m-10">
			{isPending ? <InfiniteProgressBar /> : <></>}
			<div>
				<div className="mb-10 text-5xl font-semibold">Write blog</div>
				<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
					<div className="grid gap-1.5">
						<Label>Blog title</Label>
						<Input
							placeholder="Title for your blog"
							id="title"
							className="w-full"
							{...register("title", { required: "Title is required" })}
						/>
						{errors.title ? (
							<span className="text-sm text-red-600 list-none">
								{errors.title.message}
							</span>
						) : (
							<></>
						)}
					</div>

					<div className="grid gap-1.5">
						<Label>Description</Label>
						<Input
							placeholder="Description of your blog"
							id="description"
							className="w-full"
							{...register("description", {
								required: "Description is required",
							})}
						/>
						{errors.description ? (
							<span className="text-sm text-red-600 list-none">
								{errors.description.message}
							</span>
						) : (
							<></>
						)}
					</div>

					<div className="grid w-full max-w-sm items-center gap-1.5">
						<Label>Cover picture</Label>
						<Input
							id="picture"
							name="picture"
							type="file"
							onChange={handleFileInput}
						/>
					</div>

					{isFileDownloading && <Skeleton className="w-44 h-44" />}
					{watch("files") ? (
						<img
							src={URL.createObjectURL(watch("files"))}
							alt="Cover"
							className="w-44 aspect-auto"
						/>
					) : (
						<Skeleton className="w-44 h-44" />
					)}
					{watch("files") && (
						<span className="text-gray-500">{watch("files").name}</span>
					)}

					<div className="grid gap-1.5">
						<Label>Tag</Label>
						<div className="max-w-sm">
							<AsyncCreatable<ApiResponse<TagList[]>, TagList, ICreateArticle>
								queryKey={QueryKeys.Tags}
								queryFunction={tagService.getAllTags}
								control={control}
								mutationFunction={(value: string) =>
									tagService.createTag(value)
								}
								name="categoryId"
								rules={{ required: "Tag is required" }}
								defaultValue=""
							/>
						</div>
					</div>

					<div className="relative ">
						<div className="mb-1">
							<Label>Blog content</Label>
						</div>
						<Editor
							control={control}
							name="content"
							rules={{ required: "Content is required" }}
						/>
					</div>

					<div className="ml-auto">
						<Button type="submit">
							{isPending || updateBlog.isLoading ? <InfiniteLoader /> : "Save"}
						</Button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default CreateorEdit_Blog;
