import mongoose, { mongo } from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDb =async function(){
    try {
        const connectInstance=await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log(`MongoDb connected Succesfully ${connectInstance.connection.host}`);
        
    } catch (error) {
        console.log("MongoDB connection Error",error);
        process.exit(1);
    }
}

export default connectDb;