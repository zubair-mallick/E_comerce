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

export const invalidateCache =  ({
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
              myCache.del(["admin-stats","admin-pie-charts","admin-bar-charts", "admin-line-charts"])
            }
            myCache.del(["admin-stats","admin-pie-charts","admin-bar-charts", "admin-line-charts"])
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

export const calculatePercentage = (thisMonth: number, lastMonth: number) => {
  if (lastMonth == 0) {
    return Number((thisMonth * 100).toFixed(0));
  }

  const percent = ((thisMonth - lastMonth) / lastMonth) * 100;

  return Number(percent.toFixed(0));
};

export const getInventories = async ({
  categories,productCount
}: {
      categories: string[];
      productCount:number;
    }) => {
      const categoriesCountPromise = categories.map((category) =>
        Product.countDocuments({ category })
      );
      const categoriesCount = await Promise.all(categoriesCountPromise);

      const categoryCount: { [key: string]: number }[] = [];

      categories.forEach((cat, i) => {
        categoryCount.push({
          [cat]: Math.round((categoriesCount[i] / productCount) * 100),
        });
      });

      return categoryCount;
    
};

export interface MyDocument extends Document {
  createdAt:Date,
  discount?:number,
  total?:number
}

type FuncProps={
  length: number;
  docArr: MyDocument[];
  today: Date;
  property?: "discount" | "total" ;
}

export const getChartData =({length,docArr,today,property}:FuncProps)=>{
          
                   const data = new Array(length).fill(0)

                   docArr.forEach((i) =>{
                      const creationDate=i.createdAt
                      const monthDiff = (today.getMonth() - creationDate.getMonth() +12) % 12;

                      if(monthDiff<length){
                        
                          
                        data[length - 1 - monthDiff] += property ? 
                        Math.round(i[property] as number) : 1;

                        
                    }
                })
          return data;
}
