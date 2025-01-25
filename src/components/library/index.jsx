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
      <div className="border border-[#202330] bg-[#11111e] rounded-xl hover:scale-[1.02] ease-in-out duration-300 transition-all w-full h-[19rem] relative overflow-hidden group cursor-pointer">
        <div className="absolute top-3 right-3 w-8 h-8 bg-[#2a2b35] rounded-md"></div>
        <div className="lower-part p-5">
          <div className="absolute top-14 left-5 right-5">
            <div className="w-full h-10 bg-[#2a2b35] rounded-md mb-4"></div>
            <div className="w-full h-3 bg-[#2a2b35] rounded-md mb-2"></div>
            <div className="w-full h-3 bg-[#2a2b35] rounded-md mb-2"></div>
            <div className="w-5/6 h-3 bg-[#2a2b35] rounded-md mb-2"></div>
            <div className="w-4/5 h-3 bg-[#2a2b35] rounded-md mb-2"></div>
          </div>
          <div className="flex flex-wrap gap-2 mb-3 absolute bottom-0 left-0 px-5">
            <div className="w-20 h-5 bg-[#2a2b35] rounded-md" />
            <div className="w-16 h-5 bg-[#2a2b35] rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
};

const Library = () => {
  const dispatch = useDispatch();
  const { filteredData, loading, error, llmlibrary, searchText } = useSelector(
    (state) => state.filter
  );

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

  // Slice data for the current page
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentPageData = (
    llmlibrary === filteredData && searchText === "" ? llmlibrary : filteredData
  ).slice(startIndex, startIndex + ITEMS_PER_PAGE);

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
          // While loading, display skeleton cards
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
      {!loading && filteredData.length > ITEMS_PER_PAGE && (
        <div className="pagination flex justify-center mt-6">
          <Pagination
            count={Math.ceil(filteredData.length / ITEMS_PER_PAGE)}
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
