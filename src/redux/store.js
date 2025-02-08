import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import filterReducer from "./slice/filterSlice";
import bookmarkReducer from "./slice/bookmarkSlice";

const bookmarkPersistConfig = {
  key: "bookmarks",
  storage,
  blacklist: ["_persist"],
};

const filterPersistConfig = {
  key: "filter",
  storage,
  whitelist: ["tags", "searchText"],
  blacklist: ["_persist"],
};

const persistedBookmarkReducer = persistReducer(
  bookmarkPersistConfig,
  bookmarkReducer
);
const persistedFilterReducer = persistReducer(
  filterPersistConfig,
  filterReducer
);

export const store = configureStore({
  reducer: {
    filter: persistedFilterReducer,
    bookmarks: persistedBookmarkReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
