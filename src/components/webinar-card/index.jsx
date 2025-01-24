import React, { useState } from "react";
import { MdArrowOutward } from "react-icons/md";
import { FaRegBookmark, FaBookmark } from "react-icons/fa";
import { SiteWideModal } from "../modal";

const WebinarCard = ({ webinar }) => {
  const [bookmark, setBookmark] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);

  const bookmarkHandler = (e) => {
    e.stopPropagation(); // Prevent the modal from opening on bookmark click
    setBookmark(!bookmark);
  };

  const openModal = () => {
    // Set the modal content dynamically
    setModalContent(
      <div>
        <h2 className="text-lg font-bold mb-4">{webinar.title}</h2>
        <p className="text-gray-400 text-sm mb-3">
          {webinar.description || "No description available."}
        </p>
        <div className="tags flex flex-wrap gap-2 mb-4">
          {webinar.tags &&
            webinar.tags.split(",").map((tag, index) => (
              <span
                key={index}
                className="bg-[#7F89FF]/10 border border-[#7F89FF]/50 text-white text-xs px-2 py-1 rounded-md"
              >
                {tag.trim()}
              </span>
            ))}
        </div>
        <p className="text-sm text-gray-300 mb-3">
          <span className="font-semibold">Host:</span>{" "}
          <span className="text-gray-400">{webinar.host}</span>
        </p>
        <p className="text-sm text-[#7F89FF] mb-6">{webinar.timestamp}</p>
        <a
          href={webinar.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#11111e] px-5 py-2 border border-[#7F89FF] bg-[#7F89FF] font-medium rounded-lg flex items-center w-max"
        >
          Visit Webinar <MdArrowOutward fill="#11111e" className="ml-2" />
        </a>
      </div>
    );
    setIsModalOpen(true);
  };

  if (!webinar) {
    return null;
  }

  return (
    <div>
      {/* Card */}
      <div
        className="bg-[#202330] border border-transparent hover:border-[#7F89FF] rounded-xl hover:scale-[1.02] transition-all ease-in-out duration-300 w-full h-[20rem] flex flex-col justify-between relative overflow-hidden group cursor-pointer"
        onClick={openModal} // Open the modal with updated content
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

        <div className="p-4 flex flex-col h-full">
          {/* Webinar Title */}
          <div className="flex items-start mb-2 h-[5.2rem]">
            <a
              href={webinar.url}
              target="_blank"
              rel="noopener noreferrer"
              className="header-cont flex items-center mb-2.5"
              onClick={(e) => e.stopPropagation()}
            >
              <h1 className="text-lg sm:text-xl font-semibold text-white line-clamp-3">
                {webinar.title}
              </h1>
            </a>
          </div>

          {/* Description with line-clamp */}
          <p className="text-xs sm:text-sm text-gray-400 mb-3 line-clamp-3 h-[3.9rem]">
            {webinar.description || "No description available."}
          </p>

          {/* Host and Timestamp */}
          <div className="flex flex-col mb-3">
            <span className="text-sm sm:text-base text-gray-300">
              <span className="font-semibold">Host:</span>{" "}
              <span className="text-gray-400">{webinar.host}</span>
            </span>
            <span className="text-sm sm:text-base text-[#7F89FF] h-10">
              {webinar.timestamp}
            </span>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-2">
            {webinar.tags &&
              webinar.tags.split(",").map((tag, index) => (
                <span
                  key={index}
                  className="bg-[#7F89FF]/10 border border-[#7F89FF]/50 text-white text-[10px] sm:text-xs px-2 py-1 rounded-md"
                >
                  {tag.trim()}
                </span>
              ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      <SiteWideModal
        buttonText="Trigger Modal"
        className="hidden modal-trigger-button"
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
      >
        {modalContent}
      </SiteWideModal>
    </div>
  );
};

export { WebinarCard };
