import React, { useEffect, useState } from "react";
import { CourseCard } from "../../components"; // Assuming you have a CourseCard component
import { llmCourses } from "../../api/apiCall"; // Import the llmCourses function from your API file

const CourseCardSkeleton = () => {
  return (
    <div className="animate-pulse">
      {/* Card Skeleton */}
      <div className="border border-[#202330] bg-[#11111e] rounded-xl hover:scale-[1.02] transition-all ease-in-out duration-300 w-full h-[12rem] flex flex-col justify-between relative overflow-hidden cursor-pointer group">
        {/* Bookmark Button Skeleton */}
        <div className="absolute w-8 h-8 right-3 top-3 grid place-items-center bg-[#2a2b35] rounded-md"></div>

        {/* Content Skeleton */}
        <div className="p-4 flex flex-col h-full">
          {/* Heading Skeleton */}
          <div className="flex items-center justify-between">
            <div className="w-5/6 h-12 bg-[#2a2b35] rounded mb-10"></div>
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

const Courses = () => {
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

  return (
    <>
      <div className="bg-[#11111e] px-10 py-16 w-full max-w-[100rem] mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">
          Available Courses
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 mx-auto min-h-screen">
          {loading ? (
            // Display skeleton cards while loading
            Array(4)
              .fill(0)
              .map((_, index) => (
                <div key={index} className="col-span-1">
                  <CourseCardSkeleton />
                </div>
              ))
          ) : coursesData.length > 0 ? (
            // Display actual CourseCards once data is fetched
            coursesData.map((course) => (
              <div key={course.id} className="col-span-1">
                <CourseCard course={course} />
              </div>
            ))
          ) : (
            <p className="text-white text-lg">
              No courses available at the moment.
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export { Courses };
