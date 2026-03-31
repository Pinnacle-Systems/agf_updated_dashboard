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
 
  }),
});

export const {
  useGetGeneralYearQuery,useGetGreyYarnTableQuery

} = purchaseTable;

export default purchaseTable;
