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
import { store, persistor } from "./redux/store";
import { PersistGate } from "redux-persist/integration/react";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
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
              <ToastContainer />
            </Layout>
          </BrowserRouter>
        </PersistGate>
      </Provider>
    </>
  );
}

export default App;
