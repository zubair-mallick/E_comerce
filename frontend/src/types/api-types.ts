import { cartItem, Order, Product, shippingInfo, User } from "./types";

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
export type DeleteUserRequest = {
    userId: string;
    adminUserId: string;
  };
  
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

export type productDetailResponse = {
    success:boolean;
    message:string
    product: Product;
   
}
export  type updateProductRequest ={
    userId:string,
    productId:string,
    formData:FormData

}
export  type deleteProductRequest ={
    userId:string,
    productId:string,
}

export type AllOrdersResponse = {
    success: boolean;
    orders: Order[];
  };
  export type MessageResponse = {
    success: boolean;
    message: string;
  };
  export type NewOrderRequest = {
    shippingInfo: shippingInfo;
    orderItems: cartItem[];
    subtotal: number;
    tax: number;
    shippingCharges: number;
    discount: number;
    total: number;
    user: string;
  };
  export type OrderDetailsResponse = {
    success: boolean;
    order: Order;
  };
  export type UpdateOrderRequest = {
    userId: string;
    orderId: string;
  };
  export type AllUsersResponse = {
    success: boolean;
    users: User[];
  };