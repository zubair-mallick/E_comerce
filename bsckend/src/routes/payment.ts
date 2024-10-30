import express from "express";
import { applyDiscount, newCoupon } from "../controllers/payment.js";


const app= express.Router();

app.post("/coupon/new",newCoupon)
app.post("/discount",applyDiscount)




export default app