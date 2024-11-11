import { Product, User } from "./types";

export type customError={
    status:number;
    data:{
        message:string;
        success: boolean;
    }
}

export type newUserMessageResponse={
    success:boolean;
    message:string
}
export type UserResponse={
    success:boolean;
    user:User
}


export type AllProductsResponse={
    success:boolean;
    products:Product[]
    message:string
}