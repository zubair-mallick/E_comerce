import { configureStore } from '@reduxjs/toolkit'
import { productApi } from './api/productAPI'
import { UserApi } from './api/userAPI'
import { userReducer } from './reducer/userReducer'

 

export const store = configureStore({
    reducer:{
        [UserApi.reducerPath]: UserApi.reducer,
        [productApi.reducerPath]: productApi.reducer,

        [userReducer.name]:userReducer.reducer,

    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(UserApi.middleware,productApi.middleware),
})


