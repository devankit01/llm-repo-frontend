import React, { useEffect, useState } from "react";
import { Card } from "../card";
import { useLocation, Link } from "react-router-dom";
import { Filter } from "../filter";
import { useSelector, useDispatch } from "react-redux";
import { fetchLLMTools, performLLMSearch } from "../../redux/slice/filterSlice";
import { Pagination } from "@mui/material";

const ITEMS_PER_PAGE = 12; // Number of items to display per page

const CardSkeleton = () => {
  return (
    <div className="border border-[#202330] bg-[#11111e] rounded-xl w-full h-[19rem] overflow-hidden relative animate-pulse">
      {/* Header Section */}
      <div className="absolute top-3 left-3 w-20 h-4 bg-[#2a2b35] rounded-md"></div>
      <div className="absolute top-3 right-3 w-8 h-8 bg-[#2a2b35] rounded-md"></div>

      {/* Content Section */}
      <div className="absolute top-12 left-5 right-5">
        <div className="w-1/2 h-5 bg-[#2a2b35] rounded-md mb-2"></div>
        <div className="w-full h-3 bg-[#2a2b35] rounded-md mb-2"></div>
        <div className="w-5/6 h-3 bg-[#2a2b35] rounded-md mb-2"></div>
        <div className="w-4/5 h-3 bg-[#2a2b35] rounded-md mb-2"></div>
      </div>

      {/* Tags Section */}
      <div className="absolute bottom-5 left-5 flex gap-2">
        {Array(3)
          .fill(null)
          .map((_, index) => (
            <div key={index} className="w-12 h-4 bg-[#2a2b35] rounded-md"></div>
          ))}
      </div>
    </div>
  );
};

const ButtonSkeleton = () => {
  return (
    <div className="w-36 h-10 bg-[#2a2b35] rounded-lg mx-auto animate-pulse"></div>
  );
};

const LLMTools = () => {
  const location = useLocation();
  const dispatch = useDispatch();

  const { loading, searchText, llmtool, filteredData, tags } = useSelector(
    (state) => state.filter
  );

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (searchText.trim()) {
      dispatch(performLLMSearch(searchText));
    } else {
      dispatch(fetchLLMTools());
    }
  }, [dispatch, searchText]);

  const handlePageChange = (_, page) => {
    setCurrentPage(page);
  };

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentPageData = (() => {
    if (tags.length > 0) {
      const filteredByTags = (
        searchText === "" ? llmtool : filteredData
      ).filter((tool) => {
        const toolTags = tool.tags
          ? tool.tags.split(",").map((tag) => tag.trim().toLowerCase())
          : [];
        return toolTags.some((tag) => tags.includes(tag.trim()));
      });
      return filteredByTags.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    } else if (searchText.trim() && tags.length === 0) {
      return filteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    } else {
      return llmtool.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }
  })();

  const limitedLLMTools = llmtool.slice(0, 8);

  return (
    <>
      <section>
        <div className="header mb-5">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold mb-3 md:mb-10">
            Explore Top LLMS
          </h1>
          <p className="md:text-base sm:text-sm text-xs">
            Join our curated LLM directory to boost your visibility in the
            language model ecosystem.
          </p>
        </div>
        <div
          className={`mb-5 ${
            location.pathname === "/" ? "hidden" : "lg:hidden block"
          }`}
        >
          <Filter />
        </div>
        <div className="llm-cards grid xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-2 w-full  md:mb-16 mb-8">
          {loading
            ? Array(8)
                .fill(null)
                .map((_, index) => (
                  <div className="col-span-1" key={index}>
                    <CardSkeleton />
                  </div>
                ))
            : location.pathname === "/"
            ? limitedLLMTools.map((tool, index) => (
                <div className="col-span-1" key={index}>
                  <Card tool={tool} />
                </div>
              ))
            : currentPageData.map((tool, index) => (
                <div className="col-span-1" key={index}>
                  <Card tool={tool} />
                </div>
              ))}
        </div>
        {llmtool.length > ITEMS_PER_PAGE && location.pathname !== "/" && (
          <div className="pagination flex justify-center mt-6">
            <Pagination
              count={Math.ceil(llmtool.length / ITEMS_PER_PAGE)}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
              sx={{
                "& .MuiPaginationItem-root": {
                  color: "white",
                },
                "& .Mui-selected": {
                  backgroundColor: "rgba(255, 255, 255, 0.2) !important",
                },
                "& .MuiPaginationItem-ellipsis": {
                  color: "rgba(255, 255, 255, 0.6)",
                },
              }}
            />
          </div>
        )}
        {location.pathname === "/" && (
          <div className="text-center">
            {loading ? (
              <ButtonSkeleton />
            ) : (
              <Link
                to={"/llm-tools"}
                className="bg-[#7F89FF] text-[#11111e] px-6 py-2 rounded-lg transition-all duration-300 ease-in-out font-medium"
              >
                View More
              </Link>
            )}
          </div>
        )}
      </section>
    </>
  );
};

export { LLMTools };
