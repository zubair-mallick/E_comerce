import express from 'express';


//roue imports
import userRoute from "./routes/user.js"

import { connectdb } from './utils/features.js';
import { errorMiddleware } from './middleware/error.js';

const port = process.env.PORT || 3000;

connectdb()
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.send("server is running /api/v1")
})
app.use("/api/v1/user",userRoute)


app.use(errorMiddleware)

app.listen(port,()=>
{
    console.log(`server listening on ${port}`);
    
})