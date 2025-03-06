import { NextFunction, Request, Response } from "express";

export interface NewUserRequestBody {
    name: string;
    email: string;
    photo: string;
    gender: string;
    _id: string;
    dob: Date;
  }

  export interface NewProductRequestBody {
    name: string;
    photo: string;
    category: string;
    price: number;
    stock: number;
    description?: string;
  }

  export type ControllerType=(
    (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any,Record<string,any>> >
  )

  export type SearchRequestQuery = {
    limit?:string | number;
    search?:string;
    price?:string | number;
    minPrice?:string | number;

    category?: string;
    sort? : string;
    page?: number;  

  }

  export type InvalidateCacheProp ={
    product?:boolean;
    order?:boolean;
    admin?:boolean;
    userId?:string;
    orderId?:string;
    productId?:string | string[];
    user?:boolean;
  }

  export interface OrderItem {
    name:string;
    photo:string;
    productId: string;
    quantity: number;
    price: number;
  }

  export type shippingInfo={
    address:string; 
    city:string;
    state:string;
    country:string;
    pincode:string;
  }

  export interface NewOrderRequestBody{
    shippingInfo:shippingInfo;
    user:string;
    subtotal:number;
    tax:number;
    shippingCharges:number;
    discount:number;
    total:number;
    orderItems:OrderItem[]
  }