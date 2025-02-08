import { createSlice } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const initialState = {
  llmTools: [],
  libraries: [],
  courses: [],
  webinars: [],
  gpt: [],
};

const bookmarkSlice = createSlice({
  name: "bookmarks",
  initialState,
  reducers: {
    addBookmark: (state, action) => {
      const { category, item } = action.payload;

      // Agar item exist nahi karta tabhi add karo
      if (!state[category].some((i) => i.data === item.data)) {
        state[category].push(item);
      }
    },
    removeBookmark: (state, action) => {
      const { category, item } = action.payload;

      // Existing item ko remove karo
      // state[category] = state[category].filter((i) => i.data !== item.data);
    },
  },
});

// Redux Persist Configuration
const persistConfig = {
  key: "bookmarks",
  storage,
};

export const { addBookmark, removeBookmark } = bookmarkSlice.actions;
export default persistReducer(persistConfig, bookmarkSlice.reducer);
