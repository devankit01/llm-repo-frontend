import { createSlice } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const loadBookmarks = () => {
  try {
    const savedData = localStorage.getItem("persist:bookmarks");
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      if (
        parsedData.llmTools &&
        parsedData.libraries &&
        parsedData.courses &&
        parsedData.webinars &&
        parsedData.gpt
      ) {
        return parsedData;
      }
    }
  } catch (e) {
    console.error("Error loading bookmarks from localStorage:", e);
  }

  return {
    llmTools: [],
    libraries: [],
    courses: [],
    webinars: [],
    gpt: [],
  };
};

const initialState = loadBookmarks();

const bookmarkSlice = createSlice({
  name: "bookmarks",
  initialState,
  reducers: {
    addBookmark: (state, action) => {
      const { category, item } = action.payload;
      console.log(state[category]);
      const existing = state[category].find((data) => data.pk === item.pk);
      console.log(existing);

      // if (!state[category].some((i) => i.data === item.data)) {
      //   state[category].push(item);
      // }
    },
    removeBookmark: (state, action) => {
      const { category, item } = action.payload;

      // Existing item ko remove karo
      state[category] = state[category].filter((i) => i.data !== item.data);
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
