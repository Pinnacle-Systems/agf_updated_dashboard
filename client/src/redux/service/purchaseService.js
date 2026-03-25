import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL, PURCHASE } from "../../constants/apiUrl";

const purchase = createApi({
  reducerPath: "purchase",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
  }),
  tagTypes: ["purchase"],
  endpoints: (builder) => ({
    getPurchase: builder.query({
      query: ({ params }) => {
        return {
          url: PURCHASE + "/getPurchase",
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["purchase"],
    }),
    getCompany: builder.query({
      query: ({ params }) => {
        return {
          url: PURCHASE + "/getCompany",
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["purchase"],
    }),
  }),
});

export const { useGetPurchaseQuery ,useGetCompanyQuery} = purchase;

export default purchase;
