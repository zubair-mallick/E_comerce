import { TryCatch } from "../middleware/error.js";
import { Coupon } from "../models/coupon.js";
import ErrorHandler from "../utils/utitlity-class.js";

export const newCoupon = TryCatch(async (req, res, next) => {
  const { coupon: code, amount, isActive: activeState } = req.body;

  if (!code || !amount) {
    return next(
      new ErrorHandler("Please provide all the required fields", 400)
    );
  }
  let isActive = activeState!=undefined? activeState: true ;

  try {
    const coupon = await Coupon.create({ code, amount, isActive });
    return res.status(201).json({
      success: true,
      coupon,
      message: `Coupon(${code}) created successfully`,
    });
  } catch (error: unknown) {
    if (typeof error === "object" && error !== null && "code" in error) {
      const errorWithCode = error as { code: number | string };

      if (errorWithCode.code === 11000) {
        return next(new ErrorHandler("Please enter another code", 400));
      }
    }
    throw error; // re-throw the error if it doesn't match the condition
  }
});

export const applyDiscount = TryCatch(async (req, res, next) => {
  const { coupon } = req.query;
  if (!coupon) {
    return next(new ErrorHandler("Please provide coupon code", 400));
  }
  const discount = await Coupon.findOne({ code: coupon });
  if (!discount) {
    return next(new ErrorHandler("Coupon is inavlid", 404));
  }
  if (!discount.isActive) {
    return next(new ErrorHandler("Coupon is no longer active or used", 404));
  }

  discount.isActive = false;

  await discount.save();

  return res.status(200).json({
    success: true,
    discount: discount.amount,
    message: `Coupon ${coupon} applied successfully`,
  });
});


export const deleteCoupon = TryCatch(async (req, res, next) => {


    const { couponid:id } = req.params;

    if (!id) {
      return next(new ErrorHandler("Please provide coupon code", 400));
    }
    
    const discount = await Coupon.findByIdAndDelete(id);
    
    if(!discount){
        return next(new ErrorHandler("Coupon not found", 404));
    }
  
    return res.status(200).json({
      success: true,
      coupon: discount.code,
      message: `Coupon ${discount.code} deleted  successfully`,
    });
  });

export const allCoupons = TryCatch(async (req, res, next) => {

    const coupons = await Coupon.find({});
    return res.status(200).json({
      success: true,
      coupons,
      message: "All coupons list sent successfully",
    });

});
  
