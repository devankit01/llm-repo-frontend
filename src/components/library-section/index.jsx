import React, { useState, useEffect } from "react";
import { LibraryCard } from "../library-card";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchLLMLibraries } from "../../redux/slice/filterSlice";

const LibraryCardSkeleton = () => {
  return (
    <div className="animate-pulse">
      {/* Card */}
      <div className="border border-[#202330] bg-[#11111e] rounded-xl hover:scale-[1.02] ease-in-out duration-300 transition-all w-full h-[19rem] relative overflow-hidden group cursor-pointer">
        {/* Bookmark Button */}

        <div className="absolute top-3 right-3 w-8 h-8 bg-[#2a2b35] rounded-md"></div>

        {/* Content */}
        <div className="lower-part p-5">
          {/* Title */}
          {/* <div className="absolute top-12 left-0 px-5">
            <div className="w-3/4 h-6 bg-gray-500 rounded mb-2.5" />
            <div className="w-1/2 h-4 bg-gray-400 rounded" />
          </div> */}

          {/* Description */}
          <div className="absolute top-14 left-5 right-5">
            <div className="w-full h-10 bg-[#2a2b35] rounded-md mb-4"></div>
            <div className="w-full h-3 bg-[#2a2b35] rounded-md mb-2"></div>
            <div className="w-full h-3 bg-[#2a2b35] rounded-md mb-2"></div>
            <div className="w-5/6 h-3 bg-[#2a2b35] rounded-md mb-2"></div>
            <div className="w-4/5 h-3 bg-[#2a2b35] rounded-md mb-2"></div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-3 absolute bottom-0 left-0 px-5">
            <div className="w-20 h-5 bg-[#2a2b35] rounded-md" />
            <div className="w-16 h-5 bg-[#2a2b35] rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
};

const ButtonSkeleton = () => {
  return (
    <div className="w-36 h-10 bg-[#2a2b35] rounded-lg mx-auto animate-pulse"></div>
  );
};

const LibrarySection = () => {
  const dispatch = useDispatch();
  const { llmlibrary, loading, error,filteredData } = useSelector((state) => state.filter);

  useEffect(() => {
    dispatch(fetchLLMLibraries()); // Fetch libraries using Redux thunk
  }, [dispatch]);

  // Limit to 4 libraries to display
  const limitedLibraries = llmlibrary.slice(0, 4);

  return (
    <section className="pt-20 pb-10">
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold md:mb-10 mb-5">
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
            className="bg-[#7F89FF] text-[#11111e] px-6 py-2 rounded-lg transition-all duration-300 ease-in-out font-medium"
          >
            View More
          </Link>
        )}
      </div>
    </section>
  );
};

export { LibrarySection };
