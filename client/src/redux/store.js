import { configureStore } from "@reduxjs/toolkit";
import { openTabs } from "./features";

import {
  poRegister,
  commonMast,
  supplier,
  poData,
  misDashboardService,
  ordManagement,
  UsersApi,
  misDashboardServiceERP,
  RoleApi,
  freeLookFabric,
} from "./service";
import { setupListeners } from "@reduxjs/toolkit/query";

export const store = configureStore({
  reducer: {
    openTabs,
    [poRegister.reducerPath]: poRegister.reducer,
    [commonMast.reducerPath]: commonMast.reducer,
    [misDashboardServiceERP.reducerPath]: misDashboardServiceERP.reducer,
    [supplier.reducerPath]: supplier.reducer,
    [poData.reducerPath]: poData.reducer,
    [misDashboardService.reducerPath]: misDashboardService.reducer,
    [ordManagement.reducerPath]: ordManagement.reducer,
    [UsersApi.reducerPath]: UsersApi.reducer,
    [RoleApi.reducerPath]: RoleApi.reducer,
    [freeLookFabric.reducerPath]: freeLookFabric.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
      poRegister.middleware,
      commonMast.middleware,
      supplier.middleware,
      poData.middleware,
      misDashboardService.middleware,
      ordManagement.middleware,
      misDashboardServiceERP.middleware,
      UsersApi.middleware,
      RoleApi.middleware,
      freeLookFabric.middleware,
    ]),
});

setupListeners(store.dispatch);
