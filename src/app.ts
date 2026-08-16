import express from "express";
import helemt from "helmet";
import morgan from "morgan";
import restaurantRoutes from "./routes/v1/restaurant.route";
import productRoutes from "./routes/v1/product.route";



const app = express();

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helemt());
app.use(morgan("dev"));

//serve static files from uploads folder
app.use("/uploads", express.static("uploads"));

//routes
app.use("/api/v1/restaurant", restaurantRoutes);
app.use("/api/v1", productRoutes);
export default app;