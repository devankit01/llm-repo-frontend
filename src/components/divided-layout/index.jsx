import React from "react";
import { Filter } from "../filter";
import { Footer, ScrollToTop } from "../common";

const DividedLayout = ({ children }) => {
  return (
    <>
      <div className="flex lg:flex-row flex-col h-screen pt-20 w-full">
        <div className="filters lg:w-1/5 w-full lg:sticky relative top-0 h-fit lg:px-0 px-5 lg:block hidden">
          <Filter />
        </div>
        <div className="body lg:w-4/5 w-full h-full overflow-y-auto lg:px-10 md:px-8 px-4 pt-16">
          <ScrollToTop />
          {children}
          <Footer />
        </div>
      </div>
    </>
  );
};

export { DividedLayout };
