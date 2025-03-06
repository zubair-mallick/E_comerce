import { Request } from "express";
import { redis } from "../app.js";  // Ensure Redis is properly imported
import { TryCatch } from "../middleware/error.js";
import { Order } from "../models/order.js";
import { NewOrderRequestBody } from "../types/types.js";
import { invalidateCache, reduceStock } from "../utils/features.js";
import ErrorHandler from "../utils/utitlity-class.js";

export const myOrders = TryCatch(
  async (req, res, next) => {
    const { id: user } = req.query;

    if (!user) {
      return next(new ErrorHandler("Login to access your orders", 401));
    }

    let orders = [];

    // Fetch from Redis cache
    const cachedOrders = await redis.get(`my-orders-${user}`);
    if (cachedOrders) {
      orders = JSON.parse(cachedOrders);
    } else {
      orders = await Order.find({ user });

      if (!orders.length || !orders[0]?.orderItems?.length) {
        return next(new ErrorHandler(`No orders found for user`, 404));
      }

      // Store in Redis for 1 hour
      await redis.set(`my-orders-${user}`, JSON.stringify(orders), "EX", 3600);
    }

    return res.status(200).json({
      success: true,
      orders,
      no_of_orders: orders[0]?.orderItems?.length,
      message: "All orders fetched for user successfully",
    });
  }
);

export const allOrders = TryCatch(
  async (req, res, next) => {
    let orders = [];

    // Fetch from Redis cache
    const cachedOrders = await redis.get(`all-orders`);
    if (cachedOrders) {
      orders = JSON.parse(cachedOrders);
    } else {
      orders = await Order.find().populate("user", "name");

      if (!orders.length) {
        return next(new ErrorHandler(`No orders found`, 404));
      }

      // Store in Redis for 1 hour
      await redis.set(`all-orders`, JSON.stringify(orders));
    }

    return res.status(200).json({
      success: true,
      orders,
      message: "All orders fetched successfully",
    });
  }
);

export const getSingleOrder = TryCatch(async (req, res, next) => {
  const { id } = req.params;
  const key = `singleorder-${id}`;
  let formattedOrder;
  let order
  // Fetch from Redis cache
  formattedOrder = await redis.get(key)

  if (formattedOrder) {
    formattedOrder = JSON.parse(formattedOrder);
  } else {
    order = await Order.findById(id)
      .populate("user", "name") // Populate user name
      .populate({
        path: "orderItems.productId",
        select: "photos", // Select only photos
      });

    if (!order) return next(new ErrorHandler(`No orders found`, 404));

   

  // 🔹 Transform `orderItems` to move `photos` out of `productId`
   formattedOrder = {
    ...order.toObject(),
    orderItems: order.orderItems.map((item:any) => ({
      _id: item._id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      photos: item.productId?.photos || [], // Move photos directly under orderItem
    })),
  };
  redis.set(key, JSON.stringify(formattedOrder));
}

  return res.status(200).json({
    success: true,
    order: formattedOrder,
    message: "Order fetched successfully",
  });
});

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

    // Validate required fields
    if (!shippingInfo) missingFields.push("shippingInfo");
    if (!orderItems) missingFields.push("orderItems");
    if (!user) missingFields.push("user");
    if (subtotal === undefined) missingFields.push("subtotal");
    if (tax === undefined) missingFields.push("tax");
    if (shippingCharges === undefined) missingFields.push("shippingCharges");
    if (discount === undefined) missingFields.push("discount");
    if (total === undefined) missingFields.push("total");

    if (missingFields.length > 0) {
      return next(
        new ErrorHandler(
          `Missing required fields: ${missingFields.join(", ")}`,
          400
        )
      );
    }

    const order = await Order.create({
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

    await invalidateCache({
      product: true,
      order: true,
      admin: true,
      userId: user,
      productId: order.orderItems.map((i) => String(i.productId)),
    });

    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
    });
  }
);

export const processOrder = TryCatch(async (req, res, next) => {
  let status = req.query.status as string;
  const { id } = req.params;

  const order = await Order.findById(id);
  if (!order) return next(new ErrorHandler("Order not found", 404));

  if (status) {
    if (!["Processing", "Shipped", "Delivered", "Cancelled"].includes(status)) {
      return next(new ErrorHandler("Invalid status", 400));
    }
    order.status = status as "Processing" | "Shipped" | "Delivered" | "Cancelled";
  } else {
    switch (order.status) {
      case "Processing":
        order.status = "Shipped";
        break;
      case "Shipped":
        order.status = "Delivered";
        break;
      default:
        return next(new ErrorHandler("Invalid status, delivery has reached", 400));
    }
  }

  await order.save();

  await invalidateCache({
    product: false,
    order: true,
    admin: true,
    userId: order.user,
    orderId: String(order._id),
  });

  return res.status(201).json({
    success: true,
    status: order.status,
    message: `Order status changed to '${order.status}' successfully`,
  });
});

export const deleteOrder = TryCatch(async (req, res, next) => {
  const { id } = req.params;

  const order = await Order.findById(id);
  if (!order) return next(new ErrorHandler("Order not found", 404));

  await order.deleteOne();

  await invalidateCache({
    product: false,
    order: true,
    admin: true,
    userId: order.user,
    orderId: order._id,
  });

  return res.status(201).json({
    success: true,
    message: "Order deleted successfully",
  });
});
