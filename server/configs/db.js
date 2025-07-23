import mongoose from "mongoose";

const connectDB = async () => {
    try {
        mongoose.connection.on('connected', () => {
            console.log("Database Connected");
        });
        
        mongoose.connection.on('error', (err) => {
            console.log("Connection error:", err);
        });

        await mongoose.connect(process.env.MONGODB_URI);
    } catch (error) {
        console.log("Connection failed:", error.message);
        process.exit(1); // Exit process with failure
    }
}

export default connectDB;