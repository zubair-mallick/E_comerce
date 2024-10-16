
import { NextFunction, Request, Response } from 'express';
import ErrorHandler from '../utils/utitlity-class.js';
import { ControllerType } from '../types/types.js';

export const errorMiddleware =(err: ErrorHandler, req: Request, res: Response, next: NextFunction):any => {

    err.message = err.message || "some Error Occured"
    err.statusCode= err.statusCode || 500

    return res.status(err.statusCode).json({
        success: false,  // It should be false since it's an error response
        message: err.message,
    });
}

export const TryCatch = (func:ControllerType)=>(req: Request, res: Response, next: NextFunction)=>{
    return Promise.resolve(func(req, res, next)).catch(next);
}