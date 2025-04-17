import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL, MIS_DASHBOARDERP } from "../../constants/apiUrl";


const MisDashboard = createApi({
    reducerPath: 'misDashboardServiceERP',
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_URL,
    }),
    tagTypes: ['MisDashboard'],
    endpoints: (builder) => ({
        getMisDashboard: builder.query({
            query: ({ params }) => {
                return {
                    url: MIS_DASHBOARDERP,
                    method: 'GET',
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8',
                    },
                    params
                }
            },
            providesTags: ['MisDashboard'],
        }),
        getMisDashboardOrdersInHand: builder.query({
            query: ({ params }) => {
                return {
                    url: MIS_DASHBOARDERP + "/ordersInHand",
                    method: 'GET',
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8',
                    },
                    params
                }
            },
            providesTags: ['MisDashboard'],
        }),
        getMisDashboardOrdersInHandMonthWise: builder.query({
            query: ({ params }) => {
                return {
                    url: MIS_DASHBOARDERP + "/ordersInHandMonthWise",
                    method: 'GET',
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8',
                    },
                    params
                }
            },
            providesTags: ['MisDashboard'],
        }),
        getMisDashboardActualVsBudgetValueMonthWise: builder.query({
            query: ({ params }) => {
                return {
                    url: MIS_DASHBOARDERP + "/actualVsBudgetValueMonthWise",
                    method: 'GET',
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8',
                    },
                    params
                }
            },
            providesTags: ['MisDashboard'],
        }),
        getYearlyCompERP: builder.query({
            query: ({ params }) => {
                return {
                    url: MIS_DASHBOARDERP + "/yearlyComp",
                    method: 'GET',
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8',
                    },
                    params
                }
            },
            providesTags: ['MisDashboard'],
        }),
        executeProcedure: builder.mutation({
            query: () => ({
              url: MIS_DASHBOARDERP + "/execute-procedure",
              method:  "PUT",
            }),
          }),
        getBuyerWiseRevenue: builder.query({
            query: ({ params }) => {
                return {
                    url: MIS_DASHBOARDERP + "/buyerWiseRev",
                    method: 'GET',
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8',
                    },
                    params
                }
            },
            providesTags: ['MisDashboard'],
        }),
        getBudgetVsActual: builder.query({
            query: ({ params }) => {
                return {
                    url: MIS_DASHBOARDERP + "/actualVsBudget",
                    method: 'GET',
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8',
                    },
                    params
                }
            },
            providesTags: ['MisDashboard'],
        }),
       
        getShortShipmantRatio: builder.query({
            query: ({ params }) => {
                return {
                    url: MIS_DASHBOARDERP + "/shortShipment",
                    method: 'GET',
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8',
                    },
                    params
                }
            },
            providesTags: ['MisDashboard'],
        }),

    }),
})

export const {
    useGetMisDashboardQuery,
    useGetMisDashboardOrdersInHandQuery,
    useGetMisDashboardOrdersInHandMonthWiseQuery,
    useGetMisDashboardActualVsBudgetValueMonthWiseQuery,
    useGetYearlyCompERPQuery,
    useExecuteProcedureMutation,
    useGetBuyerWiseRevenueQuery,
    useGetBudgetVsActualQuery,
    useGetShortShipmantRatioQuery

} = MisDashboard;

export default MisDashboard;