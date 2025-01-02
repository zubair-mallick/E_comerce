import { User } from "../models/user.js";
import ErrorHandler from "../utils/utitlity-class.js";
import { TryCatch } from "./error.js";

export const isAdmin =TryCatch(async(req,res,next)=>{
    const {id}= req.query;
  
    
    if(!id) return next(new ErrorHandler("Login as admin to gain acess",401));

    const user = await User.findById(id);
    if(!user || user.role!=="admin") return next(new ErrorHandler("Not an admin",401));

    next()
})