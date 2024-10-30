import { myCache } from "../app.js";
import { TryCatch } from "../middleware/error.js";
import { Order } from "../models/order.js";
import { Product } from "../models/products.js";
import { User } from "../models/user.js";
import { calculatePercentage } from "../utils/features.js";

export const getDashboardStats = TryCatch(async(req,res,next)=>{
    let stats ={};

    let key ="admin-stats"
    if(myCache.has(key)) stats = JSON.parse(myCache.get(key) as string);
    else{
        const today = new Date();

        const StartOfThisMonth = new Date(today.getFullYear(), today.getMonth(),1);
        const StartOfLastMonth = new Date(today.getFullYear(), today.getMonth()-1,1);
        const EndOfLastMonth = new Date(today.getFullYear(), today.getMonth(),0);
        const EndOfThisMonth = today

        const thisMonth ={
            start: StartOfThisMonth,
            end: EndOfThisMonth
        }
        const lastMonth ={
            start: StartOfLastMonth,
            end: EndOfLastMonth
        }

        const thisMonthProductsPromise =   Product.find({
            createdAt: {$gte: thisMonth.start, $lte: thisMonth.end}
        })

        const lastMonthProductsPromise =   Product.find({
            createdAt: {$gte: lastMonth.start, $lte: lastMonth.end}
        })

        const thisMonthUsersPromise =   User.find({
            createdAt: {$gte: thisMonth.start, $lte: thisMonth.end}
        })

        const lastMonthUsersPromise =   User.find({
            createdAt: {$gte: lastMonth.start, $lte: lastMonth.end}
        })        

        const thisMonthOrdersPromise =   Order.find({
            createdAt: {$gte: thisMonth.start, $lte: thisMonth.end}
        })

        const lastMonthOrdersPromise =   Order.find({
            createdAt: {$gte: lastMonth.start, $lte: lastMonth.end}
        })        

    const[  thisMonthProducts,
            lastMonthProducts,
            thisMonthUsers,
            lastMonthUsers,
            thisMonthOrders,
            lastMonthOrders,
            productCount,
            userCount,
            allOrders 
        ] = await Promise.all([
            thisMonthProductsPromise,
            lastMonthProductsPromise,

            thisMonthUsersPromise,
            lastMonthUsersPromise,
            
            thisMonthOrdersPromise,
            lastMonthOrdersPromise,

            Product.countDocuments(),
            User.countDocuments(),
            Order.find({}).select("total")
        ]);

        const thisMonthRevenue = thisMonthOrders.reduce((total,order)=>total + (order.total ||  0),0 )
        const lastMonthRevenue = lastMonthOrders.reduce((total,order)=>total + (order.total ||  0),0 )
           
        console.log({thisMonthRevenue,lastMonthRevenue})
        
        const changePercent={
            revenue:calculatePercentage(thisMonthRevenue,lastMonthRevenue),
            product:calculatePercentage(thisMonthProducts.length,lastMonthProducts.length),
            user: calculatePercentage(thisMonthUsers.length,lastMonthUsers.length),
            order: calculatePercentage(thisMonthOrders.length,lastMonthOrders.length),
        }

        const revenue = allOrders.reduce((total,order)=>total + (order.total || 0),0)

        const count ={
            product:productCount,
            user:userCount,
            orders: allOrders.length,
            revenue 
        }

        stats={
                changePercent,
                count
            }

        
    }

    return res.status(200).json({
        success: true,
        stats,
        message: "Dashboard stats fetched successfully"
    })
})


export const getPieStats = TryCatch(async()=>{

})

export const getBarStats = TryCatch(async()=>{

})

export const getLineStats = TryCatch(async()=>{

})