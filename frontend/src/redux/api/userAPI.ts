import {createApi,fetchBaseQuery} from "@reduxjs/toolkit/query/react"

import { newUserMessageResponse, UserResponse } from "../../types/api-types"
import { User } from "../../types/types"
import axios from "axios"
import toast from "react-hot-toast"
export const server =import.meta.env.VITE_SERVER || "http://localhost:3000/"

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

export const getUser = async(id:string)=> {
try{
    const{data}:{data:UserResponse} = await axios.get(`${server}/api/v1/user/${id}`);

    return data;
}
catch (error) {
    console.error("Error getting user info:", error);
    toast.error("Error getting User info");
    return null;
}

}

export const {useLoginMutation,} = UserApi;