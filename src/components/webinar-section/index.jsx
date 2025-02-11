import React, { useState, useEffect } from "react";
import { webinars } from "../../api/apiCall";
import { WebinarCard } from "../webinar-card";
import { Link } from "react-router-dom";

// Skeleton for Webinar Card
const WebinarCardSkeleton = () => {
  return (
    <div className="animate-pulse">
      {/* Card Skeleton */}
      <div className="border border-[#202330] bg-[#11111e] rounded-xl hover:scale-[1.02] transition-all ease-in-out duration-300 w-full h-[17rem] flex flex-col justify-between relative overflow-hidden group">
        {/* Bookmark Button Skeleton */}
        {/* <div className="absolute w-8 h-8 right-3 top-3 grid place-items-center bg-[#2a2b35] rounded-md"></div> */}

        <div className="p-4 flex flex-col h-full">
          {/* Webinar Title Skeleton */}
          <div className="flex flex-col items-start mb-2 mt-2">
            <div className="w-3/4 h-6 bg-[#2a2b35] rounded mb-2"></div>
            <div className="w-full h-6 bg-[#2a2b35] rounded mb-2"></div>
          </div>

          {/* Description Skeleton */}
          <div className="w-full h-12 bg-[#2a2b35] rounded mb-3"></div>

          {/* Host and Timestamp Skeleton */}
          <div className="flex flex-col mb-3">
            <div className="w-1/2 h-4 bg-[#2a2b35] rounded mb-2"></div>
            <div className="w-1/3 h-4 bg-[#2a2b35] rounded"></div>
          </div>

          {/* Tags Skeleton */}
          <div className="flex flex-wrap gap-2 mt-2 absolute bottom-7">
            <div className="w-20 h-5 bg-[#2a2b35] rounded-md"></div>
            <div className="w-16 h-5 bg-[#2a2b35] rounded-md"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Skeleton for View More Button
const ButtonSkeleton = () => {
  return (
    <div className="sm:w-[8.3rem] w-28 sm:h-10 h-9 bg-[#2a2b35] rounded-lg mx-auto animate-pulse"></div>
  );
};

const WebinarSection = () => {
  const [webinarsData, setWebinarsData] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state to show skeleton

  useEffect(() => {
    const fetchWebinars = async () => {
      try {
        const response = await webinars();
        let webinarsList = response.data || [];

        // Sorting by sponsor (e.g., by sponsor's name or rank)
        webinarsList = webinarsList.sort((a, b) => {
          // Assuming sponsor is a string or has a 'name' field to sort by
          const sponsorA = a.sponsor?.name || ""; // Use 'sponsor.name' if it's nested, or just 'sponsor'
          const sponsorB = b.sponsor?.name || "";
          return sponsorA.localeCompare(sponsorB); // Sorting alphabetically by sponsor's name
        });

        setWebinarsData(webinarsList); // Set sorted webinars
      } catch (error) {
        console.error("Error fetching webinars:", error);
      } finally {
        setLoading(false); // Set loading to false once data is fetched
      }
    };

    fetchWebinars();
  }, []);

  // Limit to 4 webinars to display
  const limitedWebinars = webinarsData.slice(0, 3);

  return (
    <section className="py-20">
      <h2 className="text-2xl sm:text-3xl md:text-5xl font-semibold mb-3 md:mb-10 px-2">
        Upcoming Webinars
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:mb-16 mb-8">
        {loading
          ? Array(3)
              .fill(0)
              .map((_, index) => (
                <div key={index} className="col-span-1">
                  <WebinarCardSkeleton />
                </div>
              ))
          : limitedWebinars.map((webinar, index) => (
              <WebinarCard key={index} webinar={webinar} />
            ))}
      </div>
      {/* View More Button */}
      <div className="text-center">
        {loading ? (
          <ButtonSkeleton />
        ) : (
          <Link
            to={"/llm-webinars"}
            className="bg-[#7F89FF] text-[#11111e] sm:px-6 px-5 py-2 rounded-lg transition-all duration-300 ease-in-out font-medium sm:text-base text-sm"
          >
            View More
          </Link>
        )}
      </div>
    </section>
  );
};

export { WebinarSection };
