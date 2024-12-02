import { configureStore } from '@reduxjs/toolkit'
import { productApi } from './api/productAPI'
import { UserApi } from './api/userAPI'
import { userReducer } from './reducer/userReducer'
import { cartReducer } from './reducer/cartReducer'
import { orderApi } from './api/orderAPI'

 

export const store = configureStore({
    reducer:{
        [UserApi.reducerPath]: UserApi.reducer,
        [productApi.reducerPath]: productApi.reducer,
        [orderApi.reducerPath]:orderApi.reducer,

        [userReducer.name]:userReducer.reducer,


        
        [cartReducer.name]:cartReducer.reducer,


    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(UserApi.middleware,productApi.middleware,orderApi.middleware),
})


