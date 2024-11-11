import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { AllProductsResponse } from "../../types/api-types"

export const server =import.meta.env.VITE_SERVER || "http://localhost:3000/"

export const productApi = createApi({
    reducerPath: 'productsApi',

    baseQuery: fetchBaseQuery({
        baseUrl: `${server}/api/v1/product/`,
    }),

    endpoints: (builder) => ({
        latestProducts:builder.query<AllProductsResponse,string>({ query:()=>"latest" }),
        allProducts:builder.query<AllProductsResponse,string>({ query:(id)=>`admin-products?id=${id}` }),

        
    })
})

export const { useLatestProductsQuery,useAllProductsQuery } = productApi