import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL, PURCHASE } from "../../constants/apiUrl";

const purchaseTable = createApi({
  reducerPath: "purchaseTable",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
  }),
  tagTypes: ["purchaseTable"],
  endpoints: (builder) => ({
    getGeneralYear: builder.query({
      query: ({ params }) => {
        return {
          url: PURCHASE + "/getGeneralYear",
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["purchaseTable"],
    }),
    getGreyYarnTable: builder.query({
      query: ({ params }) => {
        return {
          url: PURCHASE + "/getGreyYarnTable",
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["purchaseTable"],
    }),
    getDyedYarnTable: builder.query({
      query: ({ params }) => {
        return {
          url: PURCHASE + "/getDyedYarnTable",
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["purchaseTable"],
    }),
    getGreyFabricTable: builder.query({
      query: ({ params }) => {
        return {
          url: PURCHASE + "/getGreyFabricTable",
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["purchaseTable"],
    }),
    getDyedFabricTable: builder.query({
      query: ({ params }) => {
        return {
          url: PURCHASE + "/getDyedFabricTable",
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["purchaseTable"],
    }),
    getAccessoryTable: builder.query({
      query: ({ params }) => {
        return {
          url: PURCHASE + "/getAccessoryTable",
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["purchaseTable"],
    }),
  }),
});

export const {
  useGetGeneralYearQuery,
  useGetGreyYarnTableQuery,
  useGetDyedYarnTableQuery,
  useGetGreyFabricTableQuery,
  useGetDyedFabricTableQuery,
  useGetAccessoryTableQuery,
} = purchaseTable;

export default purchaseTable;
