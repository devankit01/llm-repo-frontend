import React, { useState } from "react";
import { MdArrowOutward } from "react-icons/md";
import { FaRegBookmark, FaBookmark } from "react-icons/fa";
import { SiteWideModal } from "../modal"; // Assume you have a reusable modal component

const CourseCard = ({ course }) => {
  const [bookmark, setBookmark] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const bookmarkHandler = (e) => {
    e.stopPropagation(); // Prevent the modal from opening on bookmark click
    setBookmark(!bookmark);
  };

  const openModal = (e) => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  if (!course) {
    return null;
  }

  const categoriesArray = course.category ? course.category.split(";") : [];

  return (
    <div>
      {/* Card */}

      <div
        onClick={openModal}
        className="bg-[#202330] border border-transparent hover:border-[#7F89FF] rounded-xl hover:scale-[1.02] transition-all ease-in-out duration-300 w-full h-[9rem] flex flex-col justify-between relative overflow-hidden cursor-pointer group"
      >
        <div className="absolute w-full flex justify-between items-center top-6 px-4">
          <span className={
              (course.sponsor
                ? " border-[#7F89FF]/50"
                : "border-transparent") +
              ` text-[11px] font-medium text-[#7F89FF] ml-auto border px-1.5 py-0.5 rounded-md tracking-wider`
            }>
            {course.sponsor == true || course.sponsor == "TRUE"
              ? "SPONSORED"
              : ""}
          </span>
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col h-full">
          {/* Heading with Arrow */}
          <div className="flex items-center justify-between">
            <a
              href={course.url}
              target="_blank"
              rel="noopener noreferrer"
              className="header-cont flex items-center mb-2.5 w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h1 className="text-lg font-semibold text-white line-clamp-1">
                {course.title}
              </h1>
              {/* <MdArrowOutward
                fill="#7F89FF"
                className="group-hover:opacity-100 opacity-0 ease-in-out duration-300 transition-all text-lg ml-3"
              /> */}
            </a>
          </div>

          {/* Text Below Heading */}
          <p className="text-xs text-gray-400 mb-2 mt-1 line-clamp-2">
            {course.text || "No details available."}
          </p>

          {/* Categories */}
          <ul className="tags flex flex-wrap gap-2 absolute bottom-4 left-0 sm:px-5 px-3.5 sm:mt-0 mt-3.5 w-full">
            {categoriesArray.map((category, index) => (
              <li
                key={index}
                className="bg-[#7F89FF]/10 border border-[#7F89FF]/50 text-white text-[10px] px-2 py-1 rounded-md uppercase"
              >
                {category.trim()}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <SiteWideModal isOpen={isModalOpen} setIsOpen={setIsModalOpen}>
          <div className="">
            <h2 className="text-lg font-bold mb-4">{course.title}</h2>
            <p className="text-gray-400 text-xs mb-3">{course.text}</p>
            <p className="text-gray-300 text-sm mb-6">{course.description}</p>

            <div className="tags flex flex-wrap gap-2 mb-8">
              {categoriesArray.map((cat, index) => (
                <span
                  key={index}
                  className="bg-[#7F89FF]/10 border border-[#7F89FF]/50 text-white text-xs px-2 py-1 rounded-md"
                >
                  {cat}
                </span>
              ))}
            </div>

            <a
              href={course.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#11111e] px-5 py-2 border border-[#7F89FF] bg-[#7F89FF] font-medium rounded-lg flex items-center w-max"
            >
              Visit Source <MdArrowOutward fill="#11111e" className="ml-2" />
            </a>
          </div>
        </SiteWideModal>
      )}
    </div>
  );
};

export { CourseCard };
