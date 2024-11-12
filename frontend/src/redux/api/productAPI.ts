import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { AllProductsResponse, categoriesResponse, messageResponse, NewProductRequest, SearchProductsArguments, SearchProductsResponse } from "../../types/api-types"

export const server =import.meta.env.VITE_SERVER || "http://localhost:3000/"

export const productApi = createApi({
    reducerPath: 'productsApi',

    baseQuery: fetchBaseQuery({
        baseUrl: `${server}/api/v1/product/`,
    }),

    endpoints: (builder) => ({
        latestProducts:builder.query<AllProductsResponse,string>({ query:()=>"latest" }),
        allProducts:builder.query<AllProductsResponse,string>({ query:(id)=>`admin-products?id=${id}` }),
        categories:builder.query<categoriesResponse,string>({ query:()=>`categories` }),
        searchProducts:builder.query<SearchProductsResponse,SearchProductsArguments>({ query:({category,page,price,search,sort,minPrice})=>{
            let baseQuery = `all?page=${page? page : 1}`
            if(price){
                baseQuery += `&price=${price}`
            }
            if(category){
                baseQuery += `&category=${category}`
            }
            if(sort){
                baseQuery += `&sort=${sort}`
            }
            if(search){
                baseQuery += `&search=${search}`
            }
            if(minPrice){
                baseQuery += `&minPrice=${minPrice}`
            }
            return baseQuery
        } }),
        newProduct:builder.mutation<messageResponse,NewProductRequest>({ query:({formData,id})=>({
            url:`new?id=${id}`,
            method:"POST",
            body:formData
        }) }),

        


        
    })
})

export const { useLatestProductsQuery,useAllProductsQuery,useCategoriesQuery ,useSearchProductsQuery,useNewProductMutation} = productApi