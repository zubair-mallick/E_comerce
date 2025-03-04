import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { AllProductsResponse, AllReviewsResponse, categoriesResponse, deleteProductRequest, DeleteReviewRequest, MessageResponse, messageResponse, NewProductRequest, NewReviewRequest, productDetailResponse, SearchProductsArguments, SearchProductsResponse, updateProductRequest } from "../../types/api-types"

export const server =import.meta.env.VITE_SERVER || "http://localhost:3000/"

export const productApi = createApi({
    reducerPath: 'productsApi',

    baseQuery: fetchBaseQuery({
        baseUrl: `${server}/api/v1/product/`,
    }),

    tagTypes:["product"],
    endpoints: (builder) => ({
        latestProducts:builder.query<AllProductsResponse,string>({
             query:()=>"latest",
             providesTags:["product"]

         }),
        allProducts:builder.query<AllProductsResponse,string>({ 
            query:(id)=>`admin-products?id=${id}`,
            providesTags:["product"]
        }),
        categories:builder.query<categoriesResponse,string>({ query:()=>`categories` }),
        searchProducts:builder.query<SearchProductsResponse,SearchProductsArguments>({ 
            query:({category,page,price,search,sort,minPrice},)=>{
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
                                                                 }, 
            providesTags:["product"]                                                
            }),

        productDetails:builder.query<productDetailResponse,string>({
                query:(id)=>id,
                providesTags:["product"]
   
            }),
            
        newProduct:builder.mutation<messageResponse,NewProductRequest>({ query:({formData,id})=>({
            url:`new?id=${id}`,
            method:"POST",
            body:formData
        }), invalidatesTags:["product"] }),
        updateProduct:builder.mutation<messageResponse,updateProductRequest>({ query:({formData,userId,productId})=>({
            url:`${productId}?id=${userId}`,
            method:"PUT",
            body:formData
        }), invalidatesTags:["product"] }),
        deleteProduct:builder.mutation<messageResponse,deleteProductRequest>({ query:({userId,productId})=>({
            url:`${productId}?id=${userId}`,
            method:"DELETE",
            
        }), invalidatesTags:["product"] }),



        allReviewsOfProducts: builder.query<AllReviewsResponse, string>({
            query: (productId) => `reviews/${productId}`,
            providesTags: ["product"],
          }),
      
          newReview: builder.mutation<MessageResponse, NewReviewRequest>({
            query: ({ comment, rating, productId, userId }) => ({
              url: `review/new/${productId}?id=${userId}`,
              method: "POST",
              body: { comment, rating },
              headers: {
                "Content-Type": "application/json",
              },
            }),
            invalidatesTags: ["product"],
          }),
      
          deleteReview: builder.mutation<MessageResponse, DeleteReviewRequest>({
            query: ({ reviewId, userId }) => ({
              url: `/review/${reviewId}?id=${userId}`,
              method: "DELETE",
            }),
            invalidatesTags: ["product"],
          }),

        


        
    })
})

export const { useLatestProductsQuery,useAllProductsQuery,useCategoriesQuery ,useSearchProductsQuery,useNewProductMutation ,useProductDetailsQuery,useDeleteProductMutation,useUpdateProductMutation,
    useAllReviewsOfProductsQuery, useNewReviewMutation,
    useDeleteReviewMutation

} = productApi