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
  }),
});

export const {
  useGetFabricDetailQuery,
  useGetFabricInwardDetailQuery,
  useGetFabricInwardCusDetailQuery,
} = freeLookFabric;

export default freeLookFabric;
