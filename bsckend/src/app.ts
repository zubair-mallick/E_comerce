import express from 'express';
import dotenv from 'dotenv';
import { connectdb } from './utils/features.js';
import { errorMiddleware } from './middleware/error.js';
import NodeCache from 'node-cache'
import {config} from "dotenv"
import morgan from 'morgan'
//roue imports
import userRoute from "./routes/user.js"
import productRoute from "./routes/product.js"
import orderRoute from "./routes/order.js"


config({
    path: "./.env"  
})

dotenv.config(); // Load environment variables
const port = process.env.PORT || 3000;


connectdb()
export const myCache = new NodeCache()
const app = express();

app.use(express.json());
app.use(morgan("dev"))

app.get('/', (req, res) => {
    res.send("server is running /api/v1")
})
app.use("/api/v1/user",userRoute)
app.use("/api/v1/product",productRoute)
app.use("/api/v1/order",orderRoute)




app.use(errorMiddleware)

app.listen(port,()=>
{
    console.log(`server listening on ${port}`);
    
})