import express from "express";
import { allCoupons, applyDiscount, createPaymentIntent, deleteCoupon, getCoupon, newCoupon, updateCoupon } from "../controllers/payment.js";
import { isAdmin } from "../middleware/auth.js";


const app= express.Router();
app.post('/create',createPaymentIntent)
app.get("/discount",applyDiscount)
app.post("/coupon/new",isAdmin,newCoupon)
app.get("/coupon/all",isAdmin,allCoupons)
app.route("/coupon/:couponid").delete(isAdmin,deleteCoupon).get(isAdmin, getCoupon)
.put(isAdmin, updateCoupon)

export default app