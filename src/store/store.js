import { configureStore } from "@reduxjs/toolkit";
import cardReducer from "./cardSlice";
import { leadersApi } from "./leaderApi";

export const store = configureStore({
  reducer: {
    cards: cardReducer,
    [leadersApi.reducerPath]: leadersApi.reducer,
  },
  middleware: getDefaultMiddleWare => getDefaultMiddleWare().concat(leadersApi.middleware),
});
