import React, { useEffect, useState } from "react";
import { WebinarCard } from "../../components";
import { webinars } from "../../api/apiCall";

const WebinarCardSkeleton = () => {
  return (
    <div className="animate-pulse">
      {/* Card Skeleton */}
      <div className="border border-[#202330] bg-[#11111e] rounded-xl hover:scale-[1.02] transition-all ease-in-out duration-300 w-full h-[17rem] flex flex-col justify-between relative overflow-hidden group">
        {/* Bookmark Button Skeleton */}
        <div className="absolute w-8 h-8 right-3 top-3 grid place-items-center bg-[#2a2b35] rounded-md"></div>

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

const Webinars = () => {
  const [webinarsData, setWebinarsData] = useState([]);
  const [loading, setLoading] = useState(true); // Added loading state

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

  return (
    <div className="min-h-screen bg-[#11111e] px-10 py-16 w-full max-w-[100rem] mx-auto">
      <h1 className="text-3xl font-bold text-white mb-8">Upcoming Webinars</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-10 mx-auto min-h-screen">
        {/* If loading, show skeletons */}
        {loading
          ? Array(4)
              .fill(0)
              .map((_, index) => (
                <div key={index} className="col-span-1">
                  <WebinarCardSkeleton />
                </div>
              ))
          : // When data is loaded, show the real WebinarCard components
            webinarsData.map((webinar) => (
              <WebinarCard key={webinar.id} webinar={webinar} />
            ))}
      </div>
    </div>
  );
};

export { Webinars };
