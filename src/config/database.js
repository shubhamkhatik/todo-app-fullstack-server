import mongoose from "mongoose";

const connectDB = async () => {
    console.log("Connecting to database...",process.env.DB_CONNECTION_STRING);
  await mongoose.connect(process.env.DB_CONNECTION_STRING);
};
export default connectDB;