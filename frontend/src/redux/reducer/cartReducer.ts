import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { cartReducerInitialState } from "../../types/reducer-types";
import { cartItem, shippingInfo } from "../../types/types";
import toast from "react-hot-toast";

const initialState: cartReducerInitialState = {
  loading: false,
  cartItems: [],
  subtotal: 0,
  tax: 0,
  shippingCharges: 0,
  discount: 0,
  total: 0,
  shippingInfo: {
    address: '',
    city: '',
    state: '',
    country: '',
    pincode: '',
  },
};

export const cartReducer = createSlice({
  name: 'cartReducer',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<cartItem>) => {
      state.loading = true;
      const index = state.cartItems.findIndex(item => item.productId === action.payload.productId);
      if (index !== -1) {
        if (action.payload.quantity === state.cartItems[index].quantity) {
          state.cartItems[index].quantity += 1;
        } else {
          state.cartItems[index].quantity += action.payload.quantity;
        }
        toast.success("Quantity increased in cart");
      } else {
        state.cartItems.push(action.payload);
        toast.success("Item added to cart");
      }
      state.loading = false;
    },
    removeCartItem: (state, action: PayloadAction<cartItem>) => {
      state.loading = true;
      const index = state.cartItems.findIndex(item => item.productId === action.payload.productId);

      if (index !== -1) {
        // Decrease quantity
        state.cartItems[index].quantity -=  1;
        // Check if quantity is zero or less and remove the item
        if (state.cartItems[index].quantity <= 0 || action.payload.quantity<=0) {
          state.cartItems = state.cartItems.filter(item => item.productId !== action.payload.productId);
          toast.success("Item removed from cart");
        } else {
          // toast.success("Quantity decreased in cart");
        }
      } else {
        toast.error("Item not found in cart");
      }

      state.loading = false;
    },
    calculatePrice:(state)=>{
      const subtotal = state.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
      state.subtotal = subtotal;
      if( subtotal==0) 
        state.shippingCharges=0
      else{
      state.shippingCharges = state.subtotal>1000?0:200;
      }
      state.tax = Math.round((state.subtotal * 0.18));
      state.total = Math.round((state.shippingCharges +state.tax +state.subtotal - state.discount))
      state.total = state.total>=0?state.total:0
    },

    discountApplied:(state, action: PayloadAction<number>)=>{
      state.loading = true; 
      state.discount = action.payload
      state.loading = false;
    },
    saveShippingInfo: (state, action: PayloadAction<shippingInfo>) => {
      state.shippingInfo = action.payload;
    },
    resetCart: () => initialState,
  }
});

export const { addToCart, removeCartItem ,calculatePrice,discountApplied,resetCart,saveShippingInfo} = cartReducer.actions;
