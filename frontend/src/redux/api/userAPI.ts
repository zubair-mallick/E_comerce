import {createApi,fetchBaseQuery} from "@reduxjs/toolkit/query/react"
import { server } from "../store"
import { newUserMessageResponse } from "../../types/api-types"
import { User } from "../../types/types"

export const UserApi = createApi({
    reducerPath: 'usersApi',

    baseQuery: fetchBaseQuery({
        baseUrl: `${server}/api/v1/user/`,
    }),

    endpoints: (builder) => ({
        login:builder.mutation<newUserMessageResponse,User>({
            query:(user)=>({
                url:"new",
                method: "POST",
                body:user
            })
        }),

        
    })
})

export const {useLoginMutation,} = UserApi;