import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL, MIS_DASHBOARD } from "../../constants/apiUrl";


const MisDashboard = createApi({
    reducerPath: 'MisDashboard',
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_URL,
    }),
    tagTypes: ['MisDashboard'],
    endpoints: (builder) => ({
        getMisDashboard: builder.query({
            query: ({ params }) => {
                return {
                    url: MIS_DASHBOARD,
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
                    url: MIS_DASHBOARD + "/ordersInHand",
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
                    url: MIS_DASHBOARD + "/ordersInHandMonthWise",
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
                    url: MIS_DASHBOARD + "/actualVsBudgetValueMonthWise",
                    method: 'GET',
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8',
                    },
                    params
                }
            },
            providesTags: ['MisDashboard'],
        }),
        getYearlyComp: builder.query({
            query: ({ params }) => {
                return {
                    url: MIS_DASHBOARD + "/yearlyComp",
                    method: 'GET',
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8',
                    },
                    params
                }
            },
            providesTags: ['MisDashboard'],
        }),
        getBuyerWiseRevenue: builder.query({
            query: ({ params }) => {
                return {
                    url: MIS_DASHBOARD + "/buyerWiseRev",
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
                    url: MIS_DASHBOARD + "/actualVsBudget",
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
                    url: MIS_DASHBOARD + "/shortShipment",
                    method: 'GET',
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8',
                    },
                    params
                }
            },
            providesTags: ['MisDashboard'],
        }),
        getEsiPf: builder.query({
            query: ({ params }) => {
                return {
                    url: MIS_DASHBOARD + "/getESIPF",
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
    useGetYearlyCompQuery,
    useGetBuyerWiseRevenueQuery,
    useGetBudgetVsActualQuery,
    useGetShortShipmantRatioQuery,
    useGetEsiPfQuery

} = MisDashboard;

export default MisDashboard;