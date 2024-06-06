import mongoose from "mongoose";
import dotenv from "dotenv";

import Config from "../config/config";

const config = Config(process.env.NODE_ENV);

mongoose
  .connect(config.database_URI || "", { autoIndex: true })
  .then(() => console.log("** MongoDB Re-Connected successfully **"))
  .catch((error) => console.error("** MongoDB Re-Connection Failed **", error));

const db = mongoose.connection;

export default db;
