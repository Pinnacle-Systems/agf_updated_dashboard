import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL, GRN } from "../../constants/apiUrl";

const grnApi = createApi({
  reducerPath: "GRNservices",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
  }),
  tagTypes: ["GRNservices"],
  endpoints: (builder) => ({
    // 1. General Purchase GRN
    getGeneralGRNTable: builder.query({
      query: ({ params }) => ({
        url: `${GRN}/getGeneralGRNTable`,
        method: "GET",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
        params,
      }),
      providesTags: ["GRNservices"],
    }),
    getGeneralGRNDetails: builder.query({
      query: ({ params }) => ({
        url: `${GRN}/getGeneralGRNDetails`,
        method: "GET",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
        params,
      }),
      providesTags: ["GRNservices"],
    }),

    // 2. Grey Fabric GRN
    getGreyFabricGRNTable: builder.query({
      query: ({ params }) => ({
        url: `${GRN}/getGreyFabricGRNTable`,
        method: "GET",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
        params,
      }),
      providesTags: ["GRNservices"],
    }),
    getGreyFabricGRNDetails: builder.query({
      query: ({ params }) => ({
        url: `${GRN}/getGreyFabricGRNDetails`,
        method: "GET",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
        params,
      }),
      providesTags: ["GRNservices"],
    }),

    // 3. Grey Yarn GRN
    getGreyYarnGRNTable: builder.query({
      query: ({ params }) => ({
        url: `${GRN}/getGreyYarnGRNTable`,
        method: "GET",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
        params,
      }),
      providesTags: ["GRNservices"],
    }),
    getGreyYarnGRNDetails: builder.query({
      query: ({ params }) => ({
        url: `${GRN}/getGreyYarnGRNDetails`,
        method: "GET",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
        params,
      }),
      providesTags: ["GRNservices"],
    }),

    // 4. Dyed Yarn GRN
    getDyedYarnGRNTable: builder.query({
      query: ({ params }) => ({
        url: `${GRN}/getDyedYarnGRNTable`,
        method: "GET",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
        params,
      }),
      providesTags: ["GRNservices"],
    }),
    getDyedYarnGRNDetails: builder.query({
      query: ({ params }) => ({
        url: `${GRN}/getDyedYarnGRNDetails`,
        method: "GET",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
        params,
      }),
      providesTags: ["GRNservices"],
    }),

    // 5. Dyed Fabric GRN
    getDyedFabricGRNTable: builder.query({
      query: ({ params }) => ({
        url: `${GRN}/getDyedFabricGRNTable`,
        method: "GET",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
        params,
      }),
      providesTags: ["GRNservices"],
    }),
    getDyedFabricGRNDetails: builder.query({
      query: ({ params }) => ({
        url: `${GRN}/getDyedFabricGRNDetails`,
        method: "GET",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
        params,
      }),
      providesTags: ["GRNservices"],
    }),

    // 6. Accessory GRN
    getAccessoryGRNTable: builder.query({
      query: ({ params }) => ({
        url: `${GRN}/getAccessoryGRNTable`,
        method: "GET",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
        params,
      }),
      providesTags: ["GRNservices"],
    }),
    getAccessoryGRNDetails: builder.query({
      query: ({ params }) => ({
        url: `${GRN}/getAccessoryGRNDetails`,
        method: "GET",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
        params,
      }),
      providesTags: ["GRNservices"],
    }),

    // 7. Cutting / Printing Store GRN
    getCuttingPrintingGRNTable: builder.query({
      query: ({ params }) => ({
        url: `${GRN}/getCuttingPrintingGRNTable`,
        method: "GET",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
        params,
      }),
      providesTags: ["GRNservices"],
    }),
    getCuttingPrintingGRNDetails: builder.query({
      query: ({ params }) => ({
        url: `${GRN}/getCuttingPrintingGRNDetails`,
        method: "GET",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
        params,
      }),
      providesTags: ["GRNservices"],
    }),

    // 8. Knitting Store GRN
    getKnittingStoreGRNTable: builder.query({
      query: ({ params }) => ({
        url: `${GRN}/getKnittingStoreGRNTable`,
        method: "GET",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
        params,
      }),
      providesTags: ["GRNservices"],
    }),
    getKnittingStoreGRNDetails: builder.query({
      query: ({ params }) => ({
        url: `${GRN}/getKnittingStoreGRNDetails`,
        method: "GET",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
        params,
      }),
      providesTags: ["GRNservices"],
    }),

    // 9. Embroidery Accessory Inward Table
    getEmbroideryAccessoryInwardTable: builder.query({
      query: ({ params }) => ({
        url: `${GRN}/getEmbroideryAccessoryInwardTable`,
        method: "GET",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
        params,
      }),
      providesTags: ["GRNservices"],
    }),
    getEmbroideryAccessoryInwardDetails: builder.query({
      query: ({ params }) => ({
        url: `${GRN}/getEmbroideryAccessoryInwardDetails`,
        method: "GET",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
        params,
      }),
      providesTags: ["GRNservices"],
    }),

    // Consolidated
    getGRNSummaryData: builder.query({
      query: ({ params }) => ({
        url: `${GRN}/getGRNSummaryData`,
        method: "GET",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
        params,
      }),
      providesTags: ["GRNservices"],
    }),
  }),
});

export const {
  useGetGeneralGRNDetailsQuery,
  useGetGeneralGRNTableQuery,

  useGetGreyFabricGRNDetailsQuery,
  useGetGreyFabricGRNTableQuery,

  useGetGreyYarnGRNDetailsQuery,
  useGetGreyYarnGRNTableQuery,

  useGetDyedYarnGRNDetailsQuery,
  useGetDyedYarnGRNTableQuery,

  useGetDyedFabricGRNDetailsQuery,
  useGetDyedFabricGRNTableQuery,

  useGetAccessoryGRNDetailsQuery,
  useGetAccessoryGRNTableQuery,

  useGetCuttingPrintingGRNDetailsQuery,
  useGetCuttingPrintingGRNTableQuery,

  useGetKnittingStoreGRNDetailsQuery,
  useGetKnittingStoreGRNTableQuery,

  useGetEmbroideryAccessoryInwardDetailsQuery,
  useGetEmbroideryAccessoryInwardTableQuery,

  useGetGRNSummaryDataQuery,
} = grnApi;

export default grnApi;
