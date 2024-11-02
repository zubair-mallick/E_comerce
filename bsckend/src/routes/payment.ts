import express from "express";
import { allCoupons, applyDiscount, createPaymentIntent, deleteCoupon, newCoupon } from "../controllers/payment.js";
import { isAdmin } from "../middleware/auth.js";


const app= express.Router();
app.post('/create',createPaymentIntent)
app.post("/discount",applyDiscount)
app.post("/coupon/new",isAdmin,newCoupon)
app.get("/all",isAdmin,allCoupons)
app.route("/coupon/:couponid").delete(isAdmin,deleteCoupon)

export default app