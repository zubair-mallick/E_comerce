import { configureStore } from '@reduxjs/toolkit'
import { productApi } from './api/productAPI'
import { userAPI } from './api/userAPI'
import { userReducer } from './reducer/userReducer'
import { cartReducer } from './reducer/cartReducer'
import { orderApi } from './api/orderAPI'
import { dashboardApi } from "./api/dashboardAPI";
 

export const store = configureStore({
    reducer:{
        [userAPI.reducerPath]: userAPI.reducer,
        [productApi.reducerPath]: productApi.reducer,
        [orderApi.reducerPath]:orderApi.reducer,
        [dashboardApi.reducerPath]: dashboardApi.reducer,
        [userReducer.name]:userReducer.reducer,


        
        [cartReducer.name]:cartReducer.reducer,


    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(userAPI.middleware,productApi.middleware,orderApi.middleware,  dashboardApi.middleware),
})

export type RootState= ReturnType<typeof store.getState>


