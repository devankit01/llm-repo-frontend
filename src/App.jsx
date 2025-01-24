import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import {
  Bookmarks,
  Courses,
  GPT,
  Home,
  LLM,
  LLMLibrary,
  Webinars,
} from "./pages";
import { Layout, Library } from "./components";
import { Provider } from "react-redux";
import { store } from "./redux/store";

function App() {
  return (
    <>
      <Provider store={store}>
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/llm-tools" element={<LLM />} />
              <Route path="/llm-courses" element={<Courses />} />
              <Route path="/llm-webinars" element={<Webinars />} />
              <Route path="/llm-library" element={<LLMLibrary />} />
              <Route path="/llm-books" element={<LLM />} />
              <Route path="/bookmarks" element={<Bookmarks />} />
              <Route path="/gpt" element={<GPT />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </Provider>
    </>
  );
}

export default App;
