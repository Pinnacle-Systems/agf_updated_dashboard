import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL, FABRIC_OUTWARD } from "../../constants/apiUrl";

const fabricOutward = createApi({
  reducerPath: "fabricOutward",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
  }),
  tagTypes: ["FabricOutward"],
  endpoints: (builder) => ({
    getFabricOutwardDetail: builder.query({
      query: ({ params }) => {
        return {
          url: `${FABRIC_OUTWARD}/getFabricOutward`,
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["FabricOutward"],
    }),
  }),
});

export const { useGetFabricOutwardDetailQuery } = fabricOutward;

export default fabricOutward;
