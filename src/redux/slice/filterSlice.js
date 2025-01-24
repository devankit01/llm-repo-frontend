import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  listLLMTools,
  gptTools,
  llmLibs,
  llmSearch as llmSearchAPI,
} from "../../api/apiCall";

// Async thunks for fetching data
export const fetchLLMTools = createAsyncThunk(
  "filter/fetchLLMTools",
  async (_, { rejectWithValue }) => {
    try {
      const response = await listLLMTools();
      const tools = response.tools || [];

      // Sort tools: Sponsored first, then ranked by rank, then remaining
      const sortedTools = tools.sort((a, b) => {
        if (a.is_sponsor && !b.is_sponsor) return -1; // Sponsored first
        if (!a.is_sponsor && b.is_sponsor) return 1;
        if (a.rank && b.rank) return parseInt(a.rank) - parseInt(b.rank); // Ranked by rank
        if (a.rank && !b.rank) return -1; // Ranked items before non-ranked
        if (!a.rank && b.rank) return 1;
        return 0; // No sorting for other cases
      });

      return sortedTools;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch LLM tools");
    }
  }
);

export const fetchGPTTools = createAsyncThunk(
  "filter/fetchGPTTools",
  async (_, { rejectWithValue }) => {
    try {
      const response = await gptTools();
      const sortedData = (response.data || []).sort((a, b) => {
        const rankA = a.rank ? parseInt(a.rank) : Infinity;
        const rankB = b.rank ? parseInt(b.rank) : Infinity;
        return rankA - rankB; // Sort by rank (ascending)
      });
      return sortedData;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch GPT tools");
    }
  }
);

export const fetchLLMLibraries = createAsyncThunk(
  "filter/fetchLLMLibraries",
  async (_, { rejectWithValue }) => {
    try {
      const response = await llmLibs();
      return response.data || [];
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch LLM libraries");
    }
  }
);

export const performLLMSearch = createAsyncThunk(
  "filter/performLLMSearch",
  async (query, { rejectWithValue }) => {
    try {
      const params = { query, limit: 3 }; // Adjust parameters as needed
      const response = await llmSearchAPI(params);
      return response.results || []; // Assuming `results` contains the data
    } catch (error) {
      return rejectWithValue(error.message || "Failed to perform LLM search");
    }
  }
);

const filterSlice = createSlice({
  name: "filter",
  initialState: {
    llmtool:[],
    llmlibrary:[],
    gpt:[],
    fetchedData: [],
    filteredData: [],
    searchText: "",
    loading: false,
    error: null,
  },
  reducers: {
    setSearchText: (state, action) => {
      state.searchText = action.payload;
    },
    gptSearch: (state, action) => {
      const query = action.payload.toLowerCase();
      state.filteredData = state.fetchedData.filter((item) =>
        item.title.toLowerCase().includes(query)
      );
    },
    librarySearch: (state, action) => {
      const query = action.payload.toLowerCase();
      state.filteredData = state.fetchedData.filter((item) =>
        item.title.toLowerCase().includes(query)
      );
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle LLM Tools
      .addCase(fetchLLMTools.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLLMTools.fulfilled, (state, action) => {
        state.loading = false;
        state.llmtool = action.payload;
        state.fetchedData = action.payload;
        state.filteredData = action.payload;
      })
      .addCase(fetchLLMTools.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle GPT Tools
      .addCase(fetchGPTTools.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGPTTools.fulfilled, (state, action) => {
        state.loading = false;
        state.gpt = action.payload;
        state.fetchedData = action.payload;
        state.filteredData = action.payload;
      })
      .addCase(fetchGPTTools.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle LLM Libraries
      .addCase(fetchLLMLibraries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLLMLibraries.fulfilled, (state, action) => {
        state.loading = false;
        state.llmlibrary = action.payload;
        state.fetchedData = action.payload;
        state.filteredData = action.payload;
      })
      .addCase(fetchLLMLibraries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle LLM Search
      .addCase(performLLMSearch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(performLLMSearch.fulfilled, (state, action) => {
        state.loading = false;
        state.filteredData = action.payload;
      })
      .addCase(performLLMSearch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setSearchText, gptSearch, librarySearch } = filterSlice.actions;
export default filterSlice.reducer;
