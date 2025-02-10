import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { LibraryCard } from "../library-card";
import { Filter } from "../filter";
import { Pagination } from "@mui/material";
import {
  fetchLLMLibraries,
  librarySearch,
} from "../../redux/slice/filterSlice";

const ITEMS_PER_PAGE = 12; // Number of items per page

const LibraryCardSkeleton = () => {
  return (
    <div className="animate-pulse">
      {/* Card */}
      <div className="border border-[#202330] bg-[#11111e] rounded-xl w-full h-[11rem] relative overflow-hidden group cursor-pointer">
        {/* Bookmark Button */}
        {/* <div className="absolute top-4 right-4 w-9 h-9 bg-[#2a2b35] rounded-md"></div> */}

        {/* Content */}
        <div className="p-6 relative">
          {/* Title */}
          <div className="w-3/4 h-4 bg-[#2a2b35] rounded mb-6"></div>

          {/* Description */}
          <div className="space-y-2 mb-3.5">
            <div className="w-full h-3 bg-[#2a2b35] rounded-md"></div>
            {/* <div className="w-full h-3 bg-[#2a2b35] rounded-md"></div> */}
            <div className="w-11/12 h-3 bg-[#2a2b35] rounded-md"></div>
            <div className="w-10/12 h-3 bg-[#2a2b35] rounded-md"></div>
          </div>

          {/* Tags */}
          <div className="flex gap-3">
            <div className="w-1/2 h-4 bg-[#2a2b35] rounded-md"></div>
            <div className="w-1/2 h-4 bg-[#2a2b35] rounded-md"></div>
            {/* <div className="w-16 h-6 bg-[#2a2b35] rounded-md"></div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

const Library = () => {
  const dispatch = useDispatch();
  const { filteredData, loading, error, llmlibrary, searchText, tags } =
    useSelector((state) => state.filter);

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (searchText.trim()) {
      dispatch(librarySearch(searchText));
    } else {
      dispatch(fetchLLMLibraries()); // Fetch libraries using Redux thunk
    }
  }, [dispatch, searchText]);

  // Handle page change
  const handlePageChange = (_, page) => {
    setCurrentPage(page);
  };

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

  const currentPageData = (() => {
    if (tags.length > 0) {
      const filteredByTags = (
        searchText === "" ? llmlibrary : filteredData
      ).filter((tool) => {
        const toolTags = tool.tags
          ? tool.tags.split(";").map((tag) => tag.trim().toLowerCase())
          : [];
        return toolTags.some((tag) => tags.includes(tag.trim()));
      });
      return filteredByTags.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    } else if (searchText.trim() && tags.length === 0) {
      return filteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    } else {
      return llmlibrary.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }
  })();

  return (
    <section className="mb-14">
      <div className="header mb-8">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold mb-3 md:mb-10">
          Explore Top Libraries
        </h1>
        <p className="md:text-base sm:text-sm text-xs">
          Discover the most comprehensive libraries to elevate your development
          workflows.
        </p>
      </div>
      <div className="mb-5 lg:hidden block">
        <Filter />
      </div>
      <div className="library-cards grid xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-2 w-full">
        {loading ? (
          Array(8)
            .fill(0)
            .map((_, index) => (
              <div className="col-span-1" key={index}>
                <LibraryCardSkeleton />
              </div>
            ))
        ) : currentPageData.length ? (
          currentPageData.map((library, index) => (
            <div className="col-span-1" key={index}>
              <LibraryCard library={library} />
            </div>
          ))
        ) : (
          <div className="text-gray-500 w-full">No Libraries available.</div>
        )}
      </div>
      {/* Pagination */}
      {llmlibrary.length > ITEMS_PER_PAGE && (
        <div className="pagination flex justify-center mt-6">
          <Pagination
            count={Math.ceil(llmlibrary.length / ITEMS_PER_PAGE)}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            sx={{
              "& .MuiPaginationItem-root": {
                color: "white", // Light text color
              },
              "& .Mui-selected": {
                backgroundColor: "rgba(255, 255, 255, 0.2) !important", // Highlight selected page
              },
              "& .MuiPaginationItem-ellipsis": {
                color: "rgba(255, 255, 255, 0.6)", // Lighter ellipsis color
              },
            }}
          />
        </div>
      )}
    </section>
  );
};

export { Library };
