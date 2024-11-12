import { Product, User } from "./types";

export type customError={
    status:number;
    data:{
        message:string;
        success: boolean;
    }
}
export type messageResponse={
    success:boolean;
    message:string
}

export type newUserMessageResponse= messageResponse;

export type UserResponse={
    success:boolean;
    user:User
}


export type AllProductsResponse= messageResponse &{
   
    products:Product[]
   
}

export type categoriesResponse= messageResponse &{
  
    categories:string[]
  
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

export  type NewProductRequest ={
    id:string,
    formData:FormData
}

