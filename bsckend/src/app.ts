import express from 'express';
import dotenv from 'dotenv';
import { connectdb } from './utils/features.js';
import { errorMiddleware } from './middleware/error.js';

//roue imports
import userRoute from "./routes/user.js"
import productRoute from "./routes/product.js"



dotenv.config(); // Load environment variables


const port = process.env.PORT || 3000;

connectdb()
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.send("server is running /api/v1")
})
app.use("/api/v1/user",userRoute)
app.use("/api/v1/product",productRoute)



app.use(errorMiddleware)

app.listen(port,()=>
{
    console.log(`server listening on ${port}`);
    
})