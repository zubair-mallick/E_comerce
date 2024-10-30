import { TryCatch } from "../middleware/error.js";
import { Coupon } from "../models/coupon.js";
import ErrorHandler from "../utils/utitlity-class.js";

export const newCoupon= TryCatch(async(req,res,next)=>{
    const {coupon:code ,amount,isActive : activeState} = req.body

    if(!code ||!amount ){
        return next(new ErrorHandler("Please provide all the required fields",400))
    }
    let isActive = activeState ? true: false

    try {
        const coupon =await Coupon.create({code,amount,isActive})
        return res.status(201).json({
        success:true,
        coupon,
        message:`Coupon(${code}) created successfully`
    })
    } catch (error: unknown) {
        if (typeof error === 'object' && error !== null && 'code' in error) {
            const errorWithCode = error as { code: number | string };
    
            if (errorWithCode.code === 11000) {
                return next(new ErrorHandler("Please enter another code", 400));
            }
        }
        throw error ; // re-throw the error if it doesn't match the condition
    }

})
