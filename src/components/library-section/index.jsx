import React, { useState, useEffect } from "react";
import { LibraryCard } from "../library-card";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchLLMLibraries } from "../../redux/slice/filterSlice";

const LibraryCardSkeleton = () => {
  return (
    <div className="animate-pulse">
      {/* Card */}
      <div className="border border-[#202330] bg-[#11111e] rounded-xl w-full h-[11rem] relative overflow-hidden group cursor-pointer">
        {/* Bookmark Button */}
        {/* <div className="absolute top-4 right-4 w-9 h-9 bg-[#2a2b35] rounded-md"></div> */}

        {/* Content */}
        <div className=" sm:p-5 p-3.5 relative">
          {/* Title */}
          <div className="w-3/4 h-6 bg-[#2a2b35] rounded mb-3"></div>

          {/* Description */}
          <div className="space-y-2 mb-14">
            <div className="w-full h-3 bg-[#2a2b35] rounded-md"></div>
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

const ButtonSkeleton = () => {
  return (
    <div className="sm:w-[8.3rem] w-28 sm:h-10 h-9 bg-[#2a2b35] rounded-lg mx-auto animate-pulse"></div>
  );
};

const LibrarySection = () => {
  const dispatch = useDispatch();
  const { llmlibrary, loading, error, filteredData } = useSelector(
    (state) => state.filter
  );

  useEffect(() => {
    dispatch(fetchLLMLibraries()); // Fetch libraries using Redux thunk
  }, [dispatch]);

  // Limit to 4 libraries to display
  const limitedLibraries = llmlibrary.slice(0, 4);

  return (
    <section className="pt-20 pb-10">
      <h2 className="text-2xl sm:text-3xl md:text-5xl font-semibold mb-3 md:mb-10 px-2">
        Popular Libraries
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:mb-16 mb-8">
        {loading
          ? // While loading, display skeleton cards
            Array(4)
              .fill(0)
              .map((_, index) => <LibraryCardSkeleton key={index} />)
          : // Once data is loaded, display the actual LibraryCards
            limitedLibraries.map((library, index) => (
              <LibraryCard key={index} library={library} />
            ))}
      </div>
      {/* View More Button */}
      <div className="text-center">
        {loading ? (
          <ButtonSkeleton />
        ) : (
          <Link
            to={"/llm-library"}
            className="bg-[#7F89FF] text-[#11111e] sm:px-6 px-5 py-2 rounded-lg transition-all duration-300 ease-in-out font-medium sm:text-base text-sm"
          >
            View More
          </Link>
        )}
      </div>
    </section>
  );
};

export { LibrarySection };
