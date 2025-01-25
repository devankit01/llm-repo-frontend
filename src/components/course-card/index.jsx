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
        className="bg-[#202330] border border-transparent hover:border-[#7F89FF] rounded-xl hover:scale-[1.02] transition-all ease-in-out duration-300 w-full h-[12rem] flex flex-col justify-between relative overflow-hidden cursor-pointer group"
      >
        {/* Bookmark Button */}
        <button
          onClick={(e) => bookmarkHandler(e)}
          className="absolute w-8 h-8 right-3 top-3 grid place-items-center bg-[#202330] z-20 rounded-md opacity-50 hover:opacity-100 duration-300 transition-all ease-in-out"
        >
          {bookmark ? (
            <FaBookmark fill="#7F89FF" />
          ) : (
            <FaRegBookmark fill="#7F89FF" />
          )}
        </button>

        {/* Content */}
        <div className="p-4 flex flex-col h-full">
          {/* Heading with Arrow */}
          <div className="flex items-center justify-between">
            <a
              href={course.url}
              target="_blank"
              rel="noopener noreferrer"
              className="header-cont flex items-center mb-2.5 w-[calc(100%-3rem)]"
              onClick={(e) => e.stopPropagation()}
            >
              <h1 className="text-lg font-semibold text-white h-20 line-clamp-3">
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
          <div className="tags flex flex-wrap gap-2 mb-3 absolute bottom-0 left-0 px-5">
            {categoriesArray.map((category, index) => (
              <span
                key={index}
                className="bg-[#7F89FF]/10 border border-[#7F89FF]/50 text-white text-[10px] px-2 py-1 rounded-md"
              >
                {category.trim()}
              </span>
            ))}
          </div>
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
