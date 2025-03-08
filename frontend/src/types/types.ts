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
    photos: string[];
    price: number;
    stock: number;
    description: string;
    category: string;
    createdAt?: string;
    updatedAt?: string;
    ratings?: number;
    numOfReviews?: number;
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
        photos:string[];
        name:string;
        price:number;
        quantity: number;
        stock:number;
        _id?:string;
    }

    export type OrderItem = Omit<cartItem, "stock" > & { _id: string };

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


      type CountAndChange = {
        revenue: number;
        product: number;
        user: number;
        order: number;
      };
      
      type LatestTransaction = {
        _id: string;
        amount: number;
        discount: number;
        quantity: number;
        status: string;
      };
            
export type Stats = {
    categoryCount: Record<string, number>[];
    changePercent: CountAndChange;
    count: CountAndChange;
    chart: {
      order: number[];
      revenue: number[];
    };
    userRatio: {
      male: number;
      female: number;
    };
    latestTransaction: LatestTransaction[];
  };

  
type OrderFullfillment = {
    processing: number;
    shipped: number;
    delivered: number;
  };
  
  type RevenueDistribution = {
    netMargin: number;
    discount: number;
    productionCost: number;
    burnt: number;
    marketingCost: number;
  };
  
  type UsersAgeGroup = {
    teen: number;
    adult: number;
    old: number;
  };
  
  export type Pie = {
    orderFullfillment: OrderFullfillment;
    productCategories: Record<string, number>[];
    stockAvailablity: {
      inStock: number;
      outOfStock: number;
    };
    revenueDistribution: RevenueDistribution;
    usersAgeGroup: UsersAgeGroup;
    adminCustomer: {
      admin: number;
      customer: number;
    };
  };
  
  export type Bar = {
    users: number[];
    products: number[];
    orders: number[];
  };
  export type Line = {
    users: number[];
    products: number[];
    discount: number[];
    revenue: number[];
  };
  export type CouponType = {
    code: string;
    amount: number;
    _id: string;
  };

  export type Review = {
    rating: number;
    comment: string;
    product: string;
    user: {
      name: string;
      photo: string;
      _id: string;
    };
    _id: string;
  };