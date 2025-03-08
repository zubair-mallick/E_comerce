import { cartItem, shippingInfo, User } from "./types";

export interface UserReducerInitialState{
    user: User | null;
    loading: boolean;
}
export interface cartReducerInitialState{
    
    loading: boolean;
    cartItems: cartItem[];
    subtotal: number;
    coupon?:string
    tax:number;
    shippingCharges: number;
    discount:number;
    total: number;
    shippingInfo:shippingInfo
    
}