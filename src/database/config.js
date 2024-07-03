import mongoose from "mongoose";
require('dotenv').config();

const connectToDb = mongoose.connect(process.env.MONGO_URL);

export default connectToDb;