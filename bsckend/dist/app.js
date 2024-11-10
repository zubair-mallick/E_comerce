import express from 'express';
import dotenv from 'dotenv';
import { connectdb } from './utils/features.js';
import { errorMiddleware } from './middleware/error.js';
import NodeCache from 'node-cache';
import { config } from "dotenv";
import morgan from 'morgan';
import Stripe from 'stripe';
//roue imports
import userRoute from "./routes/user.js";
import productRoute from "./routes/product.js";
import orderRoute from "./routes/order.js";
import paymentRoute from "./routes/payment.js";
import dashboardRoute from "./routes/stats.js";
import cors from "cors";
config({
    path: "./.env"
});
dotenv.config(); // Load environment variables
const port = process.env.PORT || 3000;
const stripeKey = process.env.STRIPE_KEY || "";
connectdb();
export const stripe = new Stripe(stripeKey);
export const myCache = new NodeCache();
const app = express();
app.use(cors({
    origin: [process.env.CORS_ORIGIN],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
    credentials: true,
}));
app.use(express.json());
app.use(morgan("dev"));
app.get('/', (req, res) => {
    res.send("server is running /api/v1");
});
app.use("/api/v1/user", userRoute);
app.use("/api/v1/product", productRoute);
app.use("/api/v1/order", orderRoute);
app.use("/api/v1/payment", paymentRoute);
app.use("/api/v1/dashboard", dashboardRoute);
app.use(errorMiddleware);
app.listen(port, () => {
    console.log(`server listening on ${port}`);
});
