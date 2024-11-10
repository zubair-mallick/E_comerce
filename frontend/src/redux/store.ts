import {configureStore} from '@reduxjs/toolkit'
import { UserApi } from './api/userAPI'
import { userReducer } from './reducer/userReducer'

 

export const store = configureStore({
    reducer:{
        [UserApi.reducerPath]: UserApi.reducer,
        [userReducer.name]:userReducer.reducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(UserApi.middleware),
})


