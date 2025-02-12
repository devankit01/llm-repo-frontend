import axios from "axios";

const base_url = process.env.REACT_APP_BASE_URL;

const apiClient = axios.create({
  baseURL: base_url,
  headers: {
    "Content-Type": "application/json",
    "x-api-key": "xyz",
  },
});

const handleError = (error) => {
  console.error("API call failed:", error.response || error.message);
  throw error.response?.data || error.message;
};

export const llmSearch = async (params) => {
  try {
    const response = await apiClient.post("/llm-search", params); // Pass params directly
    // console.log(response);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const listLLMTools = async () => {
  try {
    const response = await apiClient.get("/list_tools/llm_tools");
    // console.log(response.data);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const gptTools = async () => {
  try {
    const response = await apiClient.get("/gpt-tools");
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const llmBooks = async () => {
  try {
    const response = await apiClient.get("/llm-books");
    // console.log(response);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const llmCourses = async () => {
  try {
    const response = await apiClient.get("/llm-courses");
    // console.log(response.data);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const webinars = async () => {
  try {
    const response = await apiClient.get("/webinars");
    // console.log(response);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const llmLibs = async () => {
  try {
    const response = await apiClient.get("/llm-libs");
    // console.log(response.data);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const toolSubmit = async (data) => {
  try {
    const response = await apiClient.post("/send-email", data);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};
