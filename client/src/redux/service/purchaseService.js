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
    getPurchaseOrder: builder.query({
      query: ({ params }) => {
        return {
          url: PURCHASE + "/getPurchaseOrder",
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["purchase"],
    }),
    getMonthPurchaseOrder: builder.query({
      query: ({ params }) => {
        return {
          url: PURCHASE + "/getMonthPurchaseOrder",
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["purchase"],
    }),
    getYearPurchaseOrder: builder.query({
      query: ({ params }) => {
        return {
          url: PURCHASE + "/getYearPurchaseOrder",
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["purchase"],
    }),
    getQuarterPurchaseOrder: builder.query({
      query: ({ params }) => {
        return {
          url: PURCHASE + "/getQuarterPurchaseOrder",
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["purchase"],
    }),
    getRawMaterialWise: builder.query({
      query: ({ params }) => {
        return {
          url: PURCHASE + "/getMaterialWise",
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

export const {
  useGetPurchaseQuery,
  useGetCompanyQuery,
  useGetPurchaseOrderQuery,
  useGetMonthPurchaseOrderQuery,
  useGetYearPurchaseOrderQuery,
  useGetQuarterPurchaseOrderQuery,
  useGetRawMaterialWiseQuery
} = purchase;

export default purchase;
