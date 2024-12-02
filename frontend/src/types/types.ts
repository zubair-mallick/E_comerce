export type User={
    name:string,
    email:string;
    photo:string;
    gender:string;
    role:string;
    dob:string;
    _id:string;
}

export type Product={
    _id: string;
    name: string;
    photo: string;
    price: number;
    stock: number;
    category: string;
    createdAt?: string;
    updatedAt?: string;
    __v?: number;
}

export type shippingInfo={
        address:string;
        city:string;
        state:string;
        country:string;
        pincode:string;
    }

    export type cartItem={
        productId:string;
        photo:string;
        name:string;
        price:number;
        quantity: number;
        stock:number;
    }

    export type OrderItem = Omit<cartItem, "stock"> & { _id: string };

    export type Order = {
        orderItems: OrderItem[];
        shippingInfo: shippingInfo;
        subtotal: number;
        tax: number;
        shippingCharges: number;
        discount: number;
        total: number;
        status: string;
        user: {
          name: string;
          _id: string;
        };
        _id: string;
      };