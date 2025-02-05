import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { GPTCard } from "../gptCard";
import { Pagination, Skeleton } from "@mui/material";
import { Filter } from "../filter";
import { fetchGPTTools, gptSearch } from "../../redux/slice/filterSlice";

const ITEMS_PER_PAGE = 12; 

const GPTTools = () => {
  const dispatch = useDispatch();
  const { gpt, loading, searchText, filteredData,tags } = useSelector(
    (state) => state.filter
  );
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (searchText.trim()) {
      dispatch(gptSearch(searchText));
    } else {
      dispatch(fetchGPTTools());
    }
  }, [dispatch, searchText]);

  const handlePageChange = (_, page) => {
    setCurrentPage(page);
  };

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

  // const currentPageData =
  //   searchText === ""
  //     ? gpt.slice(startIndex, startIndex + ITEMS_PER_PAGE)
  //     : filteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const currentPageData = (() => {
    if (tags.length > 0) {
      const filteredByTags = (
        searchText === "" ? gpt : filteredData
      ).filter((tool) => {
        const toolTags = tool.category
          ? tool.category.split(";").map((tag) => tag.trim().toLowerCase())
          : [];
        return toolTags.some((tag) => tags.includes(tag.trim()));
      });
      return filteredByTags.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    } else if (searchText.trim() && tags.length === 0) {
      return filteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    } else {
      return gpt.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }
  })();

  return (
    <section>
      <div className="header mb-8">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold mb-3 md:mb-10">
          Explore Top GPT Tools
        </h1>
        <p className="md:text-base sm:text-sm text-xs">
          Discover the best GPT tools to enhance your AI-driven workflows and
          capabilities.
        </p>
      </div>
      <div className="mb-5 lg:hidden block">
        <Filter />
      </div>
      <div className="gpt-cards grid xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-2 w-full">
        {loading ? (
          Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
            <div className="col-span-1" key={index}>
              <Skeleton
                variant="rectangular"
                width="100%"
                height={200}
                sx={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
              />
              <Skeleton
                variant="text"
                sx={{
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  marginTop: 1,
                }}
              />
              <Skeleton
                variant="text"
                width="60%"
                sx={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
              />
            </div>
          ))
        ) : currentPageData.length > 0 ? (
          currentPageData.map((tool, index) => (
            <div className="col-span-1" key={index}>
              <GPTCard tool={tool} />
            </div>
          ))
        ) : (
          <div className="text-gray-500 w-full">No GPT Tools available.</div>
        )}
      </div>
      {!loading && gpt.length > ITEMS_PER_PAGE && (
        <div className="pagination flex justify-center mt-6">
          <Pagination
            count={Math.ceil(
              (searchText === "" ? gpt.length : filteredData.length) /
                ITEMS_PER_PAGE
            )}
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
    </section>
  );
};

export { GPTTools };
