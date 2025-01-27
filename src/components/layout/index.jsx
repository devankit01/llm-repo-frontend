import React from "react";
import { Footer, Navbar, ScrollToTop } from "../common";
import { useLocation } from "react-router-dom";

const Layout = ({ children }) => {
  const location = useLocation().pathname;

  return (
    <>
      <main className="flex flex-col min-h-screen">
        {["/", "/llm-courses", "/llm-webinars", "/bookmarks"].includes(
          location
        ) ? (
          <ScrollToTop />
        ) : (
          <></>
        )}
        <Navbar />
        <div
          className={` ${
            ["/", "/llm-courses", "/llm-webinars", "/bookmarks"].includes(
              location
            )
              ? "pt-20"
              : ""
          } flex`}
        >
          {children}
        </div>
        {["/", "/llm-courses", "/llm-webinars", "/bookmarks"].includes(
          location
        ) ? (
          <Footer />
        ) : (
          <></>
        )}
      </main>
    </>
  );
};

export { Layout };
