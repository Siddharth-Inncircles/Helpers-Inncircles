import mongoose  from "mongoose";

const connectDB = async() : Promise<void> => {
    try {
        const MONGODB_URI : string = 'mongodb://127.0.0.1:27017/test';
        await mongoose.connect(MONGODB_URI)
        console.log('Connected to DB');
    } catch (error) {
        console.log(error);
    }
}

export default connectDB;