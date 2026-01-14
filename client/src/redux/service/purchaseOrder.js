import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL, PURCHASE_ORDER } from "../../constants/apiUrl";

const purchaseOrder = createApi({
  reducerPath: "purchaseOrder",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
  }),
  tagTypes: ["PurchaseOrder"],
  endpoints: (builder) => ({
    getPurchaseOrderLoadData: builder.query({
      query: ({ params }) => {
        return {
          url: `${PURCHASE_ORDER}/purLoadData`,
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["PurchaseOrder"],
    }),
    getSupplierPOSData: builder.query({
      query: ({ params }) => {
        return {
          url: `${PURCHASE_ORDER}/supplierPOs`,
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["PurchaseOrder"],
    }),
    getSupplierPOSMonthData: builder.query({
      query: ({ params }) => {
        return {
          url: `${PURCHASE_ORDER}/supplierPOSMonth`,
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["PurchaseOrder"],
    }),
    getSupplierPODetails: builder.query({
      query: ({ params }) => {
        return {
          url: `${PURCHASE_ORDER}/getSupplierDetails`,
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["PurchaseOrder"],
    }),
    getSupplierList: builder.query({
      query: () => {
        return {
          url: `${PURCHASE_ORDER}/getSuppliers`,
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        };
      },
      providesTags: ["PurchaseOrder"],
    }),
  }),
});
export const {
  useGetPurchaseOrderLoadDataQuery,
  useGetSupplierPOSDataQuery,
  useGetSupplierPOSMonthDataQuery,
  useGetSupplierPODetailsQuery,
  useGetSupplierListQuery
} = purchaseOrder;
export default purchaseOrder;
