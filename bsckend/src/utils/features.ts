import mongoose from "mongoose";
import { InvalidateCacheProp, OrderItem } from "../types/types.js";
import { myCache } from "../app.js";
import { Product } from "../models/products.js";
export const connectdb = () => {
  mongoose
    .connect(process.env.MONGODB_URI!, {
      dbName: process.env.DBNAME!,
    })
    .then((c) => console.log(`db sonnected to ${c.connection.host}`))
    .catch((err) => console.log(`db conection error :${err}`));
};

export const invalidateCache = async ({
  product,
  order,
  admin,
  userId,
  orderId,
  productId,
}: InvalidateCacheProp) => {
  if (product) {
    const productKeys: string[] = [
      "latest-product",
      "category",
      "adminProducts",
    ];
    if (typeof productId === "string")
      productKeys.push(`singleProduct-${productId}`);
    console.log("here");
    if (Array.isArray(productId)) {
      productId!.forEach((productId) => {
        productKeys.push(`singleProduct-${productId}`);
      });
    }
    myCache.del(productKeys);
  }
  if (order) {
    const orderKeys: string[] = [
      "all-orders",
      `my-orders-${userId}`,
      `singleorder-${orderId}`,
    ];

    myCache.del(orderKeys);
  }
  if (admin) {
  }
};

export const reduceStock = async (orderItems: OrderItem[]) => {
  for (let i = 0; i < orderItems.length; i++) {
    const order = orderItems[i];
    const product = await Product.findById(order.productId);
    if (!product) {
      throw new Error(`Product not found ${order.productId}`);
    }
    product.stock -= order.quantity;
    await product.save();
  }
};

export const calculatePercentage =  (thisMonth:number ,lastMonth:number) => {
    
    if(lastMonth==0) {
      return Number((thisMonth* 100).toFixed(2));
    }

    const percent = ((thisMonth - lastMonth)/ lastMonth)*100
    
    return Number(percent.toFixed(0));
}