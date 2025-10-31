import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL, ROLE_API } from "../../constants/apiUrl";
import { get } from "lodash";
// import { createRoleOnPage } from "../../../../src/services/RoleMaster.service";

const RoleApi = createApi({
    reducerPath: "rolemaster",
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_URL,
    }),
    tagTypes: ["Rolemast"],
    endpoints: (builder) => ({


        addRole: builder.mutation({
            query: (payload) => ({
                url: ROLE_API,
                method: "POST",
                body: payload,
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                },
            }),
            invalidatesTags: ["Rolemast"],
        }),

        getRole:builder.query({
            query:()=>{
                return{
                    url:`${ROLE_API}/get`,
                    method:"GET",
                    headers: {
                        "Content-type": "application/json; charset=UTF-8",
                    },
                }
            },
            providesTags: ["Rolemast"],

        }),
        createRoleOnPage: builder.mutation({
            query: (payload) => ({
                url: ROLE_API + "/createRoleOnPage",
                method: "POST",
                body: payload,
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                },
            }),
            invalidatesTags: ["createRoleOnPage"],
        }),
       
        addnewuser: builder.mutation({
            query: (payload) => ({
                url: ROLE_API + "/addnewuser",
                method: "POST",
                body: payload,
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                },
            }),
            invalidatesTags: ["addnewuser"],
        }),
      


    }),
});

export const {
    useAddRoleMutation,
    useGetRoleQuery,
    useCreateRoleOnPageMutation,
    useAddnewuserMutation
    
} = RoleApi;

export default RoleApi;
