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

export type categoriesResponse={
    success:boolean;
    categories:string[]
    message:string
}


export type SearchProductsResponse= AllProductsResponse & {
   
    isFirstPage: boolean,
    isLastPage: boolean,
    
}

export type SearchProductsArguments=  {
   
    search?: string,
    sort?:string,
    category?:string,
    price?:number,
    minPrice?:number,
    page?: number,
 
    
}
