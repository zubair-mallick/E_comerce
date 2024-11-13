export interface User{
    name:string,
    email:string;
    photo:string;
    gender:string;
    role:string;
    dob:string;
    _id:string;
}

export interface Product{
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