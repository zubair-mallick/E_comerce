import { stripe } from "../app.js";
import { TryCatch } from "../middleware/error.js";
import { Coupon } from "../models/coupon.js";
import { Product } from "../models/products.js";
import { User } from "../models/user.js";
import ErrorHandler from "../utils/utitlity-class.js";
import { OrderItem, shippingInfo } from "../types/types.js";

export const createPaymentIntent = TryCatch(async (req, res, next) => {
  const { id } = req.query;

  const user = await User.findById(id).select("name");

  if (!user) return next(new ErrorHandler("Please login first", 401));

  const {
    items,
    shippingInfo,
    coupon,
  }: {
    items: OrderItem[];
    shippingInfo: shippingInfo | undefined;
    coupon: string | undefined;
  } = req.body;

  if (!items) return next(new ErrorHandler("Please send items", 400));

  if (!shippingInfo)
    return next(new ErrorHandler("Please send shipping info", 400));

  let discountAmount = 0;

  if (coupon) {
    const discount = await Coupon.findOne({ code: coupon });
    if (!discount) return next(new ErrorHandler("Invalid Coupon Code", 400));
    discountAmount = discount.amount;
  }

  const productIDs = items.map((item) => item.productId);

  const products = await Product.find({
    _id: { $in: productIDs },
  });

  const subtotal = products.reduce((prev, curr) => {
    const item = items.find((i) => i.productId === curr._id.toString());
    if (!item) return prev;
    return curr.price * item.quantity + prev;
  }, 0);

  const tax = subtotal * 0.18;

  const shipping = subtotal > 1000 ? 0 : 200;

  const total = Math.floor(subtotal + tax + shipping - discountAmount);

  const paymentIntent = await stripe.paymentIntents.create({
    amount: total * 100,
    currency: "inr",
    description: "MERN-Ecommerce",
    shipping: {
      name: user.name,
      address: {
        line1: shippingInfo.address,
        postal_code: shippingInfo.pincode.toString(),
        city: shippingInfo.city,
        state: shippingInfo.state,
        country: shippingInfo.country,
      },
    },
  });

  return res.status(201).json({
    success: true,
    clientSecret: paymentIntent.client_secret,
  });
});




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

  // discount.isActive = false;

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
  
export const getCoupon = TryCatch(async (req, res, next) => {
  const { couponid:id } = req.params;
  console.log(id);
  const coupon = await Coupon.findById(id);

  if (!coupon) return next(new ErrorHandler("Invalid Coupon ID", 400));

  return res.status(200).json({
    success: true,
    coupon,
  });
});

export const updateCoupon = TryCatch(async (req, res, next) => {
  const { couponid:id } = req.params;

  const { code, amount } = req.body;

  const coupon = await Coupon.findById(id);

  if (!coupon) return next(new ErrorHandler("Invalid Coupon ID", 400));

  if (code) coupon.code = code;
  if (amount) coupon.amount = amount;

  await coupon.save();

  return res.status(200).json({
    success: true,
    message: `Coupon ${coupon.code} Updated Successfully`,
  });
});