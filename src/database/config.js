import mongoose from "mongoose";
import "dotenv/config";

const connectToDb = mongoose.connect(process.env.MONGO_URL);

export default connectToDb;