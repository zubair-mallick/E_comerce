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