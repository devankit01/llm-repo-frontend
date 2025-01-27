import { configureStore } from "@reduxjs/toolkit";
import filterReducer from "./slice/filterSlice";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["filter"],
};

const persistedReducer = persistReducer(persistConfig, filterReducer);

export const store = configureStore({
  reducer: {
    filter: persistedReducer,
  },
});

export const persistor = persistStore(store);
