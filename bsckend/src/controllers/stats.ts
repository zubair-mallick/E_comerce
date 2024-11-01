import { myCache } from "../app.js";
import { TryCatch } from "../middleware/error.js";
import { Order } from "../models/order.js";
import { Product } from "../models/products.js";
import { User } from "../models/user.js";
import { calculatePercentage, getInventories } from "../utils/features.js";

export const getDashboardStats = TryCatch(async(req,res,next)=>{
    let stats ={};

    let key ="admin-stats"
    if(myCache.has(key)) stats = JSON.parse(myCache.get(key) as string);
    else
    {
            const today = new Date();
            const sixMonthsAgo= new Date()

            sixMonthsAgo.setMonth(sixMonthsAgo.getMonth()-6)

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
            
            const lastSixMonthOrdersPromise = Order.find({
                createdAt: {$gte: sixMonthsAgo , $lte:today}
            })

            const latestTransactionProise = Order.find({}).select(["orderItems","discount","total","status"]).limit(4)

            const[  thisMonthProducts,
                    lastMonthProducts,
                    thisMonthUsers,
                    lastMonthUsers,
                    thisMonthOrders,
                    lastMonthOrders,
                    productCount,
                    userCount,
                    allOrders,
                    lastSixMonthOrders,
                    categories,
                    maleUsersCount,
                    femaleUsersCount,
                    latestTransaction
                ] = await Promise.all([
                    thisMonthProductsPromise,
                    lastMonthProductsPromise,

                    thisMonthUsersPromise,
                    lastMonthUsersPromise,
                    
                    thisMonthOrdersPromise,
                    lastMonthOrdersPromise,

                    Product.countDocuments(),
                    User.countDocuments(),
                    Order.find({}).select("total"),

                    lastSixMonthOrdersPromise,
                    Product.distinct("category"),

                    User.countDocuments({gender: "male"}),
                    User.countDocuments({gender: "female"}),
                    latestTransactionProise
                ]);

                const thisMonthRevenue = thisMonthOrders.reduce((total,order)=>total + (order.total ||  0),0 )
                const lastMonthRevenue = lastMonthOrders.reduce((total,order)=>total + (order.total ||  0),0 )
                
            
                
                const changePercent={
                    revenue:calculatePercentage(thisMonthRevenue,lastMonthRevenue),
                    product:calculatePercentage(thisMonthProducts.length,lastMonthProducts.length),
                    user: calculatePercentage(thisMonthUsers.length,lastMonthUsers.length),
                    order: calculatePercentage(thisMonthOrders.length,lastMonthOrders.length),
                }

                const revenue = Number((allOrders.reduce((total,order)=>total + (order.total || 0),0)).toFixed(0))

                const count ={
                    product:productCount,
                    user:userCount,
                    orders: allOrders.length,
                    revenue 
                }

                const orderMonthCounts = new Array(6).fill(0)
                const orderMonthRevenue = new Array(6).fill(0)

                lastSixMonthOrders.forEach((order) =>{
                    const creationDate=order.createdAt
                    const monthDiff = today.getMonth() - creationDate.getMonth();

                    if(monthDiff<6){
                        orderMonthCounts[6-1-monthDiff] +=1;
                        orderMonthRevenue[6-1-monthDiff] += Math.round(order.total || 0);
                    }
                })


                const categoryCount: { [key: string]: number }[] = await getInventories({categories,productCount})

               
                const userRatio={
                    male:  maleUsersCount,
                    female:femaleUsersCount,
                    others:userCount-femaleUsersCount-maleUsersCount,
                }

                const modifyTransaction = latestTransaction.map((i)=>({
                    _id:i._id,
                    discount:i.discount,
                    amount:i.total,
                    status:i.status,
                    quantity:i.orderItems.length
                }))

                stats={
                        latestTransaction:modifyTransaction,
                        userRatio,
                        categoryCount,
                        changePercent,
                        count,
                        chart:{
                            order:orderMonthCounts,
                            revenue:(orderMonthRevenue),
                            
                        }
                    }

                myCache.set(key,JSON.stringify(stats))
        }

    return res.status(200).json({
        success: true,
        stats,
        message: "Dashboard stats fetched successfully"
    })
})


export const getPieStats = TryCatch(async(req,res,next)=>{
    let charts;
    const key = "admin-pie-charts"

    if(myCache.has(key)){
        charts= JSON.parse(myCache.get(key) as string);
    }
    else{
            const [
                processingOrders,
                shippedOrders,
                deliveredOrders,
                categories,
                productCount,
                productsOutOFStock,
                allOrders,
                allUsers,
                adminUsers,
                customerUsers
            ] 
            = await Promise.all([
                Order.countDocuments({status:"Processing"}),
                Order.countDocuments({status:"Shipped"}),
                Order.countDocuments({status:"Delivered"}),
                Product.distinct("category"),
                Product.countDocuments(),
                Product.countDocuments({stock:0}),
                Order.find({}).select(["total","discount","subtotal","tax","shippingCharges"]),
                User.find({}).select(["dob"]),
                User.countDocuments({role:"admin"}),
                User.countDocuments({role:"user"}),


            ])
            const orderFullFillment={
                processing:processingOrders,
                shipped:shippedOrders,
                delivered:deliveredOrders,
            }

            const productCategories: { [key: string]: number }[] = await getInventories({categories,productCount})

            const stockAvailablity= {
                insStock:productCount-productsOutOFStock,
                outOfStock:productsOutOFStock
            }

            const grossIncome = Math.round(allOrders.reduce((prev, order) =>prev +(order.total ||0),0))
            const discount = Math.round(allOrders.reduce((prev, order) =>prev +(order.discount ||0),0))
            const productionCost = Math.round(allOrders.reduce((prev, order) =>prev +(order.shippingCharges ||0),0))
            const burnt = Math.round(allOrders.reduce((prev, order) =>prev +(order.tax ||0),0))
            const marketingCost = Math.round(grossIncome * (30/100))
            const netMargin = Math.round(grossIncome - discount -productionCost - burnt - marketingCost)

            const revenueDistribution ={
                netMargin,
                discount,
                productionCost,
                burnt,
                marketingCost
            }

            const usersAgeGroup ={
                teen:allUsers.filter(user => user.age<20).length,
                adult:allUsers.filter(user => user.age>20 && user.age <40).length,
                old:allUsers.filter(user => user.age>40).length

            }

            const adminCustomer ={
                admin:adminUsers,
                customer:customerUsers
            }

            charts={
                orderFullFillment,
                adminCustomer,
                productCategories,
                stockAvailablity,
                revenueDistribution,
                usersAgeGroup
            }

          

            myCache.set(key,JSON.stringify(charts))

          
           
    }
    return res.status(200).json({
        success: true,
        charts,
        message: "Chart's stats fetched successfully"
    })
    

})

export const getBarStats = TryCatch(async()=>{

})

export const getLineStats = TryCatch(async()=>{

})