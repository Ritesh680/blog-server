import { UserContext } from "@/context/user.context";
import { useContext } from "react";
import { Link } from "react-router-dom";
import SearchBar from "../Searchbar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "../DropdownMenu";
import { Avatar, AvatarFallback, AvatarImage } from "../Avatar";
import { Button } from "../Button";

import {
	EditOutlined,
	UserOutlined,
	UsergroupAddOutlined,
	TagsOutlined,
	LogoutOutlined,
} from "@ant-design/icons";

const Navbar = () => {
	const { authenticated: isAuthenticated, userProfile } =
		useContext(UserContext);

	// function to logout the user
	const logoutUser = async () => {
		localStorage.removeItem("token");
		window.location.reload();
	};

	return (
		<>
			{isAuthenticated && userProfile ? (
				<div className="h-[57px]  flex items-center  justify-between  px-10 sticky top-0 bg-black/10 backdrop-blur-sm z-20">
					<div className="flex items-center gap-5">
						<Link
							className="text-3xl font-semibold tracking-wide cursor-pointer"
							to="/">
							Ritesh
						</Link>
						<div className="hidden cursor-text sm:block">
							<SearchBar />
						</div>
					</div>

					<div className="flex flex-row items-center gap-8">
						<div className="flex items-center gap-3">
							<div className="hidden text-sm sm:block">
								{userProfile?.username}
							</div>
							<DropdownMenu>
								<DropdownMenuTrigger>
									<Avatar>
										<AvatarImage
											src={`${import.meta.env.VITE_FILE_URL}/${
												userProfile?.imagePath?.[0]
											}`}
											alt="@shadcn"
										/>
										<AvatarFallback>
											{userProfile?.username?.slice(0, 2)}
										</AvatarFallback>
									</Avatar>
								</DropdownMenuTrigger>
								<DropdownMenuContent className=" w-60">
									<Link to="/create-blog">
										<DropdownMenuItem className="flex items-baseline text-xl">
											<EditOutlined className="w-4 h-4 mr-3" />
											Write blog
										</DropdownMenuItem>
									</Link>

									{/* <DropdownMenuSeparator /> */}
									<Link to={`/users/${userProfile?._id}`}>
										<DropdownMenuItem className="flex items-center text-xl">
											<UserOutlined className="w-4 h-4 mr-3" />
											Profile
										</DropdownMenuItem>
									</Link>
									<Link to="/tags">
										<DropdownMenuItem className="flex items-baseline text-xl">
											<TagsOutlined className="w-4 h-4 mr-3" />
											All topics
										</DropdownMenuItem>
									</Link>
									<Link to="/users">
										<DropdownMenuItem className="flex items-baseline text-xl ">
											<UsergroupAddOutlined className="w-5 h-5 mr-3" />
											All Users
										</DropdownMenuItem>
									</Link>
									<DropdownMenuSeparator />
									<DropdownMenuItem
										className="flex items-center text-xl"
										onClick={logoutUser}>
										<LogoutOutlined className="w-5 h-5 mr-3" />
										Logout
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					</div>
				</div>
			) : (
				<div className="h-[57px]  flex items-center  justify-between  px-10 sticky top-0 bg-black/10 backdrop-blur-sm z-20">
					<div className="flex items-center gap-5">
						<Link
							className="text-3xl font-semibold tracking-wide cursor-pointer"
							to="/">
							Ritesh
						</Link>
						<div className="hidden cursor-text sm:block">
							<SearchBar />
						</div>
					</div>
					<Link to="/login">
						<Button>Log in</Button>
					</Link>
				</div>
			)}
		</>
	);
};

export default Navbar;
