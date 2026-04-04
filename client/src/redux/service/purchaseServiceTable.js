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
    getTopTenSupplierGeneralTable: builder.query({
      query: ({ params }) => {
        return {
          url: PURCHASE + "/getTopTenSupplierGeneralTable",
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["purchaseTable"],
    }),
    getTopTenSupplierGreyYarnTable: builder.query({
      query: ({ params }) => {
        return {
          url: PURCHASE + "/getTopTenSupplierGreyYarnTable",
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["purchaseTable"],
    }),
    getTopTenSupplierDyedYarnTable: builder.query({
      query: ({ params }) => {
        return {
          url: PURCHASE + "/getTopTenSupplierDyedYarnTable",
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["purchaseTable"],
    }),
    getTopTenSupplierGreyFabricTable: builder.query({
      query: ({ params }) => {
        return {
          url: PURCHASE + "/getTopTenSupplierGreyFabricTable",
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["purchaseTable"],
    }),
    getTopTenSupplierDyedFabricTable: builder.query({
      query: ({ params }) => {
        return {
          url: PURCHASE + "/getTopTenSupplierDyedFabricTable",
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["purchaseTable"],
    }),
    getTopTenSupplierAccessoryTable: builder.query({
      query: ({ params }) => {
        return {
          url: PURCHASE + "/getTopTenSupplierAccessoryTable",
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["purchaseTable"],
    }),
    getTopTenSupplierListGreyYarnTable: builder.query({
      query: ({ params }) => {
        return {
          url: PURCHASE + "/getTopTenSupplierListGreyYarnTable",
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["purchaseTable"],
    }),
    getTopTenSupplierListDyedYarnTable: builder.query({
      query: ({ params }) => {
        return {
          url: PURCHASE + "/getTopTenSupplierListDyedYarnTable",
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["purchaseTable"],
    }),
    getTopTenSupplierListGreyFabricTable: builder.query({
      query: ({ params }) => {
        return {
          url: PURCHASE + "/getTopTenSupplierListGreyFabricTable",
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["purchaseTable"],
    }),
    getTopTenSupplierListDyedFabricTable: builder.query({
      query: ({ params }) => {
        return {
          url: PURCHASE + "/getTopTenSupplierListDyedFabricTable",
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["purchaseTable"],
    }),
    getTopTenSupplierListAccessoryTable: builder.query({
      query: ({ params }) => {
        return {
          url: PURCHASE + "/getTopTenSupplierListAccessoryTable",
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["purchaseTable"],
    }),
    getQuarterwiseGeneralTable: builder.query({
      query: ({ params }) => ({
        url: PURCHASE + "/getQuarterwiseGeneralTable",
        method: "GET",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
        params,
      }),
      providesTags: ["purchaseTable"],
    }),

    getQuarterwiseGreyYarnTable: builder.query({
      query: ({ params }) => ({
        url: PURCHASE + "/getQuarterwiseGreyYarnTable",
        method: "GET",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
        params,
      }),
      providesTags: ["purchaseTable"],
    }),

    getQuarterwiseDyedYarnTable: builder.query({
      query: ({ params }) => ({
        url: PURCHASE + "/getQuarterwiseDyedYarnTable",
        method: "GET",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
        params,
      }),
      providesTags: ["purchaseTable"],
    }),

    getQuarterwiseGreyFabricTable: builder.query({
      query: ({ params }) => ({
        url: PURCHASE + "/getQuarterwiseGreyFabricTable",
        method: "GET",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
        params,
      }),
      providesTags: ["purchaseTable"],
    }),

    getQuarterwiseDyedFabricTable: builder.query({
      query: ({ params }) => ({
        url: PURCHASE + "/getQuarterwiseDyedFabricTable",
        method: "GET",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
        params,
      }),
      providesTags: ["purchaseTable"],
    }),

    getQuarterwiseAccessoryTable: builder.query({
      query: ({ params }) => ({
        url: PURCHASE + "/getQuarterwiseAccessoryTable",
        method: "GET",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
        params,
      }),
      providesTags: ["purchaseTable"],
    }),
    getMonthwiseGeneralTable: builder.query({
      query: ({ params }) => ({
        url: PURCHASE + "/getMonthwiseGeneralTable",
        method: "GET",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
        params,
      }),
      providesTags: ["purchaseTable"],
    }),

    getMonthwiseGreyYarnTable: builder.query({
      query: ({ params }) => ({
        url: PURCHASE + "/getMonthwiseGreyYarnTable",
        method: "GET",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
        params,
      }),
      providesTags: ["purchaseTable"],
    }),

    getMonthwiseDyedYarnTable: builder.query({
      query: ({ params }) => ({
        url: PURCHASE + "/getMonthwiseDyedYarnTable",
        method: "GET",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
        params,
      }),
      providesTags: ["purchaseTable"],
    }),

    getMonthwiseGreyFabricTable: builder.query({
      query: ({ params }) => ({
        url: PURCHASE + "/getMonthwiseGreyFabricTable",
        method: "GET",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
        params,
      }),
      providesTags: ["purchaseTable"],
    }),

    getMonthwiseDyedFabricTable: builder.query({
      query: ({ params }) => ({
        url: PURCHASE + "/getMonthwiseDyedFabricTable",
        method: "GET",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
        params,
      }),
      providesTags: ["purchaseTable"],
    }),

    getMonthwiseAccessoryTable: builder.query({
      query: ({ params }) => ({
        url: PURCHASE + "/getMonthwiseAccessoryTable",
        method: "GET",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
        params,
      }),
      providesTags: ["purchaseTable"],
    }),
    getItemNameTable: builder.query({
      query: ({ params }) => ({
        url: PURCHASE + "/getItemNameTable",
        method: "GET",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
        params,
      }),
      providesTags: ["purchaseTable"],
    }),
    getTopTenItemGeneralTable: builder.query({
      query: ({ params }) => ({
        url: PURCHASE + "/getTopTenItemGeneralTable",
        method: "GET",
        headers: { "Content-type": "application/json; charset=UTF-8" },
        params,
      }),
      providesTags: ["purchaseTable"],
    }),

    getTopTenItemGreyYarnTable: builder.query({
      query: ({ params }) => ({
        url: PURCHASE + "/getTopTenItemGreyYarnTable",
        method: "GET",
        headers: { "Content-type": "application/json; charset=UTF-8" },
        params,
      }),
      providesTags: ["purchaseTable"],
    }),

    getTopTenItemDyedYarnTable: builder.query({
      query: ({ params }) => ({
        url: PURCHASE + "/getTopTenItemDyedYarnTable",
        method: "GET",
        headers: { "Content-type": "application/json; charset=UTF-8" },
        params,
      }),
      providesTags: ["purchaseTable"],
    }),

    getTopTenItemGreyFabricTable: builder.query({
      query: ({ params }) => ({
        url: PURCHASE + "/getTopTenItemGreyFabricTable",
        method: "GET",
        headers: { "Content-type": "application/json; charset=UTF-8" },
        params,
      }),
      providesTags: ["purchaseTable"],
    }),

    getTopTenItemDyedFabricTable: builder.query({
      query: ({ params }) => ({
        url: PURCHASE + "/getTopTenItemDyedFabricTable",
        method: "GET",
        headers: { "Content-type": "application/json; charset=UTF-8" },
        params,
      }),
      providesTags: ["purchaseTable"],
    }),

    getTopTenItemAccessoryTable: builder.query({
      query: ({ params }) => ({
        url: PURCHASE + "/getTopTenItemAccessoryTable",
        method: "GET",
        headers: { "Content-type": "application/json; charset=UTF-8" },
        params,
      }),
      providesTags: ["purchaseTable"],
    }),

    getTopTenItemListGreyYarnTable: builder.query({
      query: ({ params }) => ({
        url: PURCHASE + "/getTopTenItemListGreyYarnTable",
        method: "GET",
        headers: { "Content-type": "application/json; charset=UTF-8" },
        params,
      }),
      providesTags: ["purchaseTable"],
    }),

    getTopTenItemListDyedYarnTable: builder.query({
      query: ({ params }) => ({
        url: PURCHASE + "/getTopTenItemListDyedYarnTable",
        method: "GET",
        headers: { "Content-type": "application/json; charset=UTF-8" },
        params,
      }),
      providesTags: ["purchaseTable"],
    }),

    getTopTenItemListGreyFabricTable: builder.query({
      query: ({ params }) => ({
        url: PURCHASE + "/getTopTenItemListGreyFabricTable",
        method: "GET",
        headers: { "Content-type": "application/json; charset=UTF-8" },
        params,
      }),
      providesTags: ["purchaseTable"],
    }),

    getTopTenItemListDyedFabricTable: builder.query({
      query: ({ params }) => ({
        url: PURCHASE + "/getTopTenItemListDyedFabricTable",
        method: "GET",
        headers: { "Content-type": "application/json; charset=UTF-8" },
        params,
      }),
      providesTags: ["purchaseTable"],
    }),

    getTopTenItemListAccessoryTable: builder.query({
      query: ({ params }) => ({
        url: PURCHASE + "/getTopTenItemListAccessoryTable",
        method: "GET",
        headers: { "Content-type": "application/json; charset=UTF-8" },
        params,
      }),
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
  useGetTopTenSupplierGeneralTableQuery,
  useGetTopTenSupplierGreyYarnTableQuery,
  useGetTopTenSupplierDyedYarnTableQuery,
  useGetTopTenSupplierGreyFabricTableQuery,
  useGetTopTenSupplierDyedFabricTableQuery,
  useGetTopTenSupplierAccessoryTableQuery,
  useGetTopTenSupplierListGreyYarnTableQuery,
  useGetTopTenSupplierListDyedYarnTableQuery,
  useGetTopTenSupplierListDyedFabricTableQuery,
  useGetTopTenSupplierListGreyFabricTableQuery,
  useGetTopTenSupplierListAccessoryTableQuery,
  useGetQuarterwiseGeneralTableQuery,
  useGetQuarterwiseGreyYarnTableQuery,
  useGetQuarterwiseDyedYarnTableQuery,
  useGetQuarterwiseGreyFabricTableQuery,
  useGetQuarterwiseDyedFabricTableQuery,
  useGetQuarterwiseAccessoryTableQuery,
  useGetMonthwiseGeneralTableQuery,
  useGetMonthwiseGreyYarnTableQuery,
  useGetMonthwiseDyedYarnTableQuery,
  useGetMonthwiseGreyFabricTableQuery,
  useGetMonthwiseDyedFabricTableQuery,
  useGetMonthwiseAccessoryTableQuery,
  useGetItemNameTableQuery,
  useGetTopTenItemGeneralTableQuery,
  useGetTopTenItemGreyYarnTableQuery,
  useGetTopTenItemDyedYarnTableQuery,
  useGetTopTenItemGreyFabricTableQuery,
  useGetTopTenItemDyedFabricTableQuery,
  useGetTopTenItemAccessoryTableQuery,
  useGetTopTenItemListGreyYarnTableQuery,
  useGetTopTenItemListGreyFabricTableQuery,
  useGetTopTenItemListDyedYarnTableQuery,
  useGetTopTenItemListDyedFabricTableQuery,
  useGetTopTenItemListAccessoryTableQuery
} = purchaseTable;

export default purchaseTable;
