import  express  from "express";
import { isAdmin } from "../middleware/auth.js";
import { newCoupon } from "../controllers/payment.js";


const app= express.Router();

app.post("/coupon/new",newCoupon)



export default app