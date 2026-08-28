import http from "http"
import app from "./app";
import dotenv from "dotenv";
import { connectDB } from "./config/db";

dotenv.config();

//connect to database
connectDB();


const PORT = process.env.PORT || 3000;
const server = http.createServer(app);

server.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
});