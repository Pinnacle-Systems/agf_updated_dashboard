import { configureStore } from "@reduxjs/toolkit";
import { openTabs } from "./features";

import { poRegister, commonMast, supplier, poData, misDashboardService, ordManagement, UsersApi } from './service'
import { setupListeners } from '@reduxjs/toolkit/query'

export const store = configureStore({
    reducer: {
        openTabs,
        [poRegister.reducerPath]: poRegister.reducer,
        [commonMast.reducerPath]: commonMast.reducer,
        [supplier.reducerPath]: supplier.reducer,
        [poData.reducerPath]: poData.reducer,
        [misDashboardService.reducerPath]: misDashboardService.reducer,
        [ordManagement.reducerPath]: ordManagement.reducer,
        [UsersApi.reducerPath]: UsersApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat([
            poRegister.middleware,
            commonMast.middleware,
            supplier.middleware,
            poData.middleware,
            misDashboardService.middleware,
            ordManagement.middleware,
            UsersApi.middleware,
        ]
        ),
});

setupListeners(store.dispatch);
