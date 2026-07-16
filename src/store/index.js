/* global process */
import { configureStore } from "@reduxjs/toolkit";
import logger from "redux-logger";
import themeReducer from "./themeSlice";
import toastReducer from "./toastSlice";
import userReducer from "./userSlice";
import configReducer from "./configSlice";

const isDev = typeof process !== "undefined" && process.env?.NODE_ENV !== "production";

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    toast: toastReducer,
    user: userReducer,
    config: configReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(isDev ? logger : []),
  devTools: isDev,
});
