import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL, PROCESS, WORK_ORDER } from "../../constants/apiUrl";

const processApi = createApi({
  reducerPath: "ProcessDetails",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
  }),
  tagTypes: ["ProcessDetails"],
  endpoints: (builder) => ({
    getProcessData: builder.query({
      query: ({ params }) => {
        return {
          url: `${PROCESS}/getProcessDetails`,
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["ProcessDetails"],
    }),
    getProcessDataTable: builder.query({
      query: ({ params }) => {
        return {
          url: `${PROCESS}/getProcessDetailsTable`,
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["ProcessDetails"],
    }),
    getAccessoryProcessData: builder.query({
      query: ({ params }) => {
        return {
          url: `${PROCESS}/getAccessoryProcessData`,
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["ProcessDetails"],
    }),
    getAccessoryProcessDetailsTable: builder.query({
      query: ({ params }) => {
        return {
          url: `${PROCESS}/getAccessoryProcessDetailsTable`,
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["ProcessDetails"],
    }),
    getYarnProcessData: builder.query({
      query: ({ params }) => {
        return {
          url: `${PROCESS}/getYarnProcessData`,
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["ProcessDetails"],
    }),
    getYarnProcessDetailsTable: builder.query({
      query: ({ params }) => {
        return {
          url: `${PROCESS}/getYarnProcessDetailsTable`,
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["ProcessDetails"],
    }),
    getDyedFabricProcessData: builder.query({
      query: ({ params }) => {
        return {
          url: `${PROCESS}/getDyedFabricProcessData`,
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,

        };
      },
      providesTags: ["ProcessDetails"],
    }),
    getDyedFabricProcessDetailsTable: builder.query({
      query: ({ params }) => {
        return {
          url: `${PROCESS}/getDyedFabricProcessDetailsTable`,
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["ProcessDetails"],
    }),

    getWorkOrderBillRegisterData: builder.query({
      query: ({ params }) => {
        return {
          url: `${PROCESS}/getWorkOrderBillRegisterData`,
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["ProcessDetails"],
    }),
    getWorkOrderBillTableData: builder.query({
      query: ({ params }) => {
        return {
          url: `${PROCESS}/getWorkOrderBillTableData`,
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["ProcessDetails"],
    }),

  })
});
export const {
  useGetProcessDataQuery,
  useGetProcessDataTableQuery,
  useGetAccessoryProcessDataQuery,
  useGetAccessoryProcessDetailsTableQuery,
  useGetYarnProcessDataQuery,
  useGetYarnProcessDetailsTableQuery,
  useGetDyedFabricProcessDataQuery,
  useGetDyedFabricProcessDetailsTableQuery,

  useGetWorkOrderBillRegisterDataQuery,
  useGetWorkOrderBillTableDataQuery,


} = processApi;
export default processApi;
