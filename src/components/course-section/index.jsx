import React, { useState, useEffect } from "react";
import { llmCourses } from "../../api/apiCall"; // Import the API call for courses
import { CourseCard } from "../course-card"; // Assuming you have a CourseCard component
import { Link } from "react-router-dom";

// Skeleton for Course Card
const CourseCardSkeleton = () => {
  return (
    <div className="animate-pulse">
      {/* Card Skeleton */}
      <div className="border border-[#202330] bg-[#11111e] rounded-xl hover:scale-[1.02] transition-all ease-in-out duration-300 w-full h-[10.5rem] flex flex-col justify-between relative overflow-hidden cursor-pointer group">
        {/* Bookmark Button Skeleton */}
        {/* <div className="absolute w-8 h-8 right-3 top-3 grid place-items-center bg-[#2a2b35] rounded-md"></div> */}

        {/* Content Skeleton */}
        <div className="p-4 flex flex-col h-full">
          {/* Heading Skeleton */}
          <div className="flex items-center justify-between">
            <div className="w-5/6 h-12 bg-[#2a2b35] rounded mb-3"></div>
          </div>

          {/* Text Below Heading Skeleton */}
          <div className="w-full h-4 bg-[#2a2b35] rounded mb-2"></div>
          <div className="w-3/4 h-4 bg-[#2a2b35] rounded mb-2"></div>

          {/* Categories Skeleton */}
          <div className="flex flex-wrap gap-2 mb-3 absolute bottom-0 left-0 px-5">
            <div className="w-20 h-5 bg-[#2a2b35] rounded-md"></div>
            <div className="w-16 h-5 bg-[#2a2b35] rounded-md"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Skeleton for Button
const ButtonSkeleton = () => {
  return (
    <div className="sm:w-[8.3rem] w-28 sm:h-10 h-9 bg-[#2a2b35] rounded-lg mx-auto animate-pulse"></div>
  );
};

const CourseSection = () => {
  const [coursesData, setCoursesData] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state to show skeleton

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await llmCourses(); // Fetch courses data
        let coursesList = response.data || [];

        // First, sort by sponsor name
        coursesList = coursesList.sort((a, b) => {
          const sponsorA = a.sponsor?.name || ""; // Use 'sponsor.name' or just 'sponsor'
          const sponsorB = b.sponsor?.name || "";
          return sponsorA.localeCompare(sponsorB); // Sort alphabetically by sponsor name
        });

        // Then, sort by rank within each sponsor group
        coursesList = coursesList.sort((a, b) => {
          const rankA = a.rank ? parseInt(a.rank) : Infinity; // Handle undefined rank
          const rankB = b.rank ? parseInt(b.rank) : Infinity;
          return rankA - rankB; // Sort by rank (ascending order)
        });

        setCoursesData(coursesList); // Set sorted courses data
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false); // Set loading to false after data is fetched
      }
    };

    fetchCourses();
  }, []);

  // Limit to 4 courses to display
  const limitedCourses = coursesData.slice(0, 4);

  return (
    <section className="pt-20 pb-10">
      <h2 className="text-2xl sm:text-3xl md:text-5xl font-semibold mb-3 md:mb-10 px-2">
        Popular Courses
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:mb-16 mb-8">
        {/* Display skeleton loader while loading */}
        {loading
          ? Array(4)
              .fill(0)
              .map((_, index) => (
                <div key={index} className="col-span-1">
                  <CourseCardSkeleton />
                </div>
              ))
          : // Display actual CourseCards once data is fetched
            limitedCourses.map((course, index) => (
              <div key={index} className="col-span-1">
                <CourseCard course={course} />
              </div>
            ))}
      </div>

      {/* View More Button */}
      {loading ? (
        <ButtonSkeleton /> // Show skeleton for the button while loading
      ) : (
        <div className="text-center">
          <Link
            to={"/llm-courses"}
            className="bg-[#7F89FF] text-[#11111e] sm:px-6 px-5 py-2 rounded-lg transition-all duration-300 ease-in-out font-medium sm:text-base text-sm"
          >
            View More
          </Link>
        </div>
      )}
    </section>
  );
};

export { CourseSection };
