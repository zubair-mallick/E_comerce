import { Request } from "express";
import { myCache } from "../app.js";
import { TryCatch } from "../middleware/error.js";
import { Order } from "../models/order.js";
import { NewOrderRequestBody } from "../types/types.js";
import { invalidateCache, reduceStock } from "../utils/features.js";
import ErrorHandler from "../utils/utitlity-class.js";



export const myOrders = TryCatch(
  async (req, res, next) => {
   const {id:user} = req.query
    if(!user){
      return next(new ErrorHandler("Login to access your orders",401))
 
    }

    let orders=[]
    if(myCache.has(`my-orders-${user}`)) orders = JSON.parse(myCache.get(`my-orders-${user}`)as string)
    else{
      orders = await Order.find({user})
      if(!orders) return next(new ErrorHandler(`No orders found for user: ${user}`, 404))
      
      myCache.set(`my-orders-${user}`, JSON.stringify(orders))
    }
    return res.status(200).json({
      success: true,
      orders,
      no_of_orders: orders[0].orderItems.length,
      message: "all orders fetched of user sucessfully",
    });

  }
);


export const allOrders = TryCatch(

  async (req, res, next) => {
   const {id:user} = req.query
  
    let orders=[]

    if(myCache.has(`all-orders`)) orders = JSON.parse(myCache.get(`all-orders`)as string)
    else{
      orders = await Order.find().populate("user","name")
      if(!orders) return next(new ErrorHandler(`No orders found for user: ${user}`, 404))
      
      myCache.set(`all-orders`, JSON.stringify(orders))
    }
    return res.status(200).json({
      success: true,
      orders,

      message: "all orders fetched of user sucessfully",
    });

  }
);


export const getSingleOrder = TryCatch(
  async (req, res, next) => {
    const {id} = req.params
    const key = `singleorder-${id}`
    let order
    
    if(myCache.has(key)) order = JSON.parse(myCache.get(key)as string)
      else{
      
        order = await Order.findById(id).populate("user","name")
       
        if(!order) return next(new ErrorHandler(`No orders found `, 404))
        
        myCache.set(key, JSON.stringify(order))
      }
      return res.status(200).json({
        success: true,
        order,
        message: "order fetched sucessfully",
      })

  }
);


export const newOrder = TryCatch(
  async (req: Request<{}, {}, NewOrderRequestBody>, res, next) => {
    
    const {
      shippingInfo,
      orderItems,
      user,
      subtotal,
      tax,
      shippingCharges,
      discount,
      total,
    } = req.body;
    const missingFields = [];

    // Check each field and add to missingFields array if undefined or null
    if (!shippingInfo) missingFields.push("shippingInfo");
    if (!orderItems) missingFields.push("orderItems");
    if (!user) missingFields.push("user");
    if (subtotal === undefined) missingFields.push("subtotal");
    if (tax === undefined) missingFields.push("tax");
    if (shippingCharges === undefined) missingFields.push("shippingCharges");
    if (discount === undefined) missingFields.push("discount");
    if (total === undefined) missingFields.push("total");

    // If any missing fields, throw error
    if (missingFields.length > 0) {
      return next(
        new ErrorHandler(
          `Missing required fields: ${missingFields.join(", ")}`,
          400
        )
      );
    }

    const order=await Order.create({
      shippingInfo,
      orderItems,
      user,
      subtotal,
      tax,
      shippingCharges,
      discount,
      total,
    });
    await reduceStock(orderItems);

    invalidateCache({ product: true, order: true, admin: true ,userId:user ,productId:order.orderItems.map(i=>String(i.productId))});

    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
    });
  }
);

export const processOrder = TryCatch(
  async (req, res, next) => {

   let  status = req.query.status as string;
    const {id} = req.params;
    
    const order = await Order.findById(id)

      if(!order) return next(new ErrorHandler("Order not found",404))

      

      if (status) {
        console.log("here");
        
        if(status!="Processing" && status!="Shipped" && status!= "Delivered" && status!="Cancelled"){
          return next(new ErrorHandler("Invalid status", 400));  
        }

        order.status = status as "Processing" | "Shipped" | "Delivered" | "Cancelled";
       
    }
    else{

      status= order.status
      console.log(status);
      
      switch(status) {
        case "Processing":
          order.status = "Shipped";
          break;
        case "Shipped":
          order.status = "Delivered";
          break;
       
      
        default:
          return next(new ErrorHandler("Invalid status Delivery has reached", 400));
      }
    }

    await order.save();
    console.log(order.user);
    

    invalidateCache({ product: false, order: true, admin: true,userId:order.user,orderId:String(order._id)  });

    return res.status(201).json({
      success: true,
      status: order.status,
      message: `Order status changed to  '${order.status}' successfully`,
    });
  }
);

export const deleteOrder = TryCatch(
  async (req, res, next) => {

   
    const {id} = req.params;
    
    let order: any = await Order.findById(id)

      if(!order) return next(new ErrorHandler("Order not found",404))

         await order.deleteOne();

      
    invalidateCache({ product: false, order: true, admin: true,userId:order.user,orderId:order._id });

    return res.status(201).json({
      success: true,
      order,
      message: `Order dleted successfully`,
    });
  }
);