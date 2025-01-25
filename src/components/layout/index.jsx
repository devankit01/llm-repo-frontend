import React from "react";
import { Footer, Navbar, ScrollToTop } from "../common";
import { useLocation } from "react-router-dom";

const Layout = ({ children }) => {
  const location = useLocation().pathname;

  return (
    <>
      <main className="flex flex-col min-h-screen">
        <Navbar />
        <div
          className={` ${
            location === "/" ||
            location === "/llm-courses" ||
            location === "/llm-webinars" ||
            location === "/bookmarks"
              ? "pt-20"
              : ""
          } flex`}
        >
          {children}
        </div>
        {location === "/" ||
        location === "/llm-courses" ||
        location === "/llm-webinars" ||
        location === "/bookmarks" ? (
          <Footer />
        ) : (
          <></>
        )}
      </main>
    </>
  );
};

export { Layout };
