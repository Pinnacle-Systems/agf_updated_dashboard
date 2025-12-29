import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL, FREE_LOOK_FABRIC } from "../../constants/apiUrl";

const freeLookFabric = createApi({
  reducerPath: "freeLookFabric",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
  }),
  tagTypes: ["FreeLookFabric"],
  endpoints: (builder) => ({
    getFabricDetail: builder.query({
      query: ({ params }) => {
        return {
          url: FREE_LOOK_FABRIC,
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["FreeLookFabric"],
    }),
    getFabricInwardCust: builder.query({
      query: ({ params }) => {
        return {
          url: `${FREE_LOOK_FABRIC}/fabInwardCust`,
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["FreeLookFabric"],
    }),
    getFabricInwardDetail: builder.query({
      query: ({ params }) => {
        return {
          url: `${FREE_LOOK_FABRIC}/getFabricInward`,
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["FreeLookFabric"],
    }),
    getFabricInwardCusDetail: builder.query({
      query: ({ params }) => {
        return {
          url: `${FREE_LOOK_FABRIC}/fabricInwardCustomer`,
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["FreeLookFabric"],
    }),
    getFabricInwardByCusName: builder.query({
      query: ({ params }) => {
        return {
          url: `${FREE_LOOK_FABRIC}/fabricInwardByCusName`,
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["FreeLookFabric"],
    }),
    getFabricInwardMonthDetail: builder.query({
      query: ({ params }) => {
        return {
          url: `${FREE_LOOK_FABRIC}/fabricInwardByMonth`,
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["FreeLookFabric"],
    }),
    getFabricInwardCusByMonthDetail: builder.query({
      query: ({ params }) => {
        return {
          url: `${FREE_LOOK_FABRIC}/fabricInwardCusByMonth`,
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["FreeLookFabric"],
    }),
    getFabricInwardQuarterDetail: builder.query({
      query: ({ params }) => {
        return {
          url: `${FREE_LOOK_FABRIC}/fabricInwardByQuarter`,
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["FreeLookFabric"],
    }),
    getFabricInwardQuarterNameDetail: builder.query({
      query: ({ params }) => {
        return {
          url: `${FREE_LOOK_FABRIC}/fabricInwardByQuarterName`,
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["FreeLookFabric"],
    }),
    getFabricInwardMonthDate: builder.query({
      query: ({ params }) => {
        return {
          url: `${FREE_LOOK_FABRIC}/fabricInwardByMonthDate`,
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["FreeLookFabric"],
    }),
    getFabricInwardStateDetail: builder.query({
      query: ({ params }) => {
        return {
          url: `${FREE_LOOK_FABRIC}/fabricInwardState`,
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["FreeLookFabric"],
    }),
    getFabricInwardStateDetailTrans: builder.query({
      query: ({ params }) => {
        return {
          url: `${FREE_LOOK_FABRIC}/fabricInwardStateDetail`,
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["FreeLookFabric"],
    }),
    getFabricInwardStateDropdown: builder.query({
      query: ({ params }) => {
        return {
          url: `${FREE_LOOK_FABRIC}/fabricInwardStateDropdown`,
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["FreeLookFabric"],
    }),
    getFabricInwardYearCompare: builder.query({
      query: ({ params }) => {
        return {
          url: `${FREE_LOOK_FABRIC}/fabricInwardYearCompare`,
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["FreeLookFabric"],
    }),
    getFabricOutwardDetail: builder.query({
      query: ({ params }) => {
        return {
          url: `${FREE_LOOK_FABRIC}/getFabricOutward`,
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["FreeLookFabric"],
    }),
    getFabricOutwardCusDetail: builder.query({
      query: ({ params }) => {
        return {
          url: `${FREE_LOOK_FABRIC}/fabricOutwardCustomer`,
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["FreeLookFabric"],
    }),
  }),
});

export const {
  useGetFabricDetailQuery,
  useGetFabricInwardCustQuery,
  useGetFabricInwardDetailQuery,
  useGetFabricInwardCusDetailQuery,
  useGetFabricInwardByCusNameQuery,
  useGetFabricInwardMonthDetailQuery,
  useGetFabricInwardCusByMonthDetailQuery,
  useGetFabricInwardQuarterDetailQuery,
  useGetFabricInwardQuarterNameDetailQuery,
  useGetFabricInwardMonthDateQuery,
  useGetFabricOutwardDetailQuery,
  useGetFabricOutwardCusDetailQuery,
  useGetFabricInwardStateDetailQuery,
  useGetFabricInwardStateDetailTransQuery,
  useGetFabricInwardStateDropdownQuery,
  useGetFabricInwardYearCompareQuery
} = freeLookFabric;

export default freeLookFabric;
