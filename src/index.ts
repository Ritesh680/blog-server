import express, { Express } from "express";
import db from "./db/connection";

// your routes here
import cors, { CorsOptions } from "cors";
import Config from "./config/config";
import User from "./auth/auth.model";
import { usersData } from "./seeder";
const config = Config(process.env.NODE_ENV);

const app: Express = express();
const port = config.port || 3000;

const corsOptions: CorsOptions = {
	origin: "*",
	methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
};
app.use(express.json());
app.use(cors(corsOptions));

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", async () => {
	console.log(" ");
	console.log("------> +++++ COnnected MongoDB server +++++ <------");
	console.log(" ");

	const userCount = await User.countDocuments();
	if (userCount === 0) {
		await User.insertMany(usersData);
		console.log("Default user added");
	}

	app.use("/", require("./routes"));

	app.listen(port, () => {
		console.log(`[server]: Server is running at http://localhost:${port}`);
	});
});
