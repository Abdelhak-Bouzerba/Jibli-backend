import express from "express";
import restaurantRoutes from "./routes/v1/restaurant.route";



const app = express();

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//routes
app.use("/api/v1/restaurant", restaurantRoutes);

export default app;