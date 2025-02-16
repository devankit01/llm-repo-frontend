import React, { useState } from "react";
import { MdArrowOutward } from "react-icons/md";
import { FaRegBookmark, FaBookmark } from "react-icons/fa";
import { SiteWideModal } from "../modal";

const WebinarCard = ({ webinar }) => {
  const [bookmark, setBookmark] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);

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
        className="bg-[#202330] border border-transparent hover:border-[#7F89FF] rounded-xl hover:scale-[1.02] transition-all ease-in-out duration-300 w-full h-[17rem] flex flex-col justify-between relative overflow-hidden group cursor-pointer"
        onClick={openModal} // Open the modal with updated content
      >
        {" "}
        <div className="absolute w-full flex justify-between items-center top-6 px-4">
          <span className={
              (webinar.sponsor
                ? " border-[#7F89FF]/50"
                : "border-transparent") +
              ` text-[11px] font-medium text-[#7F89FF] ml-auto border px-1.5 py-0.5 rounded-md tracking-wider`
            }>
            {webinar.sponsor == true || webinar.sponsor == "TRUE"
              ? "SPONSORED"
              : ""}
          </span>
        </div>
        <div className="p-4 flex flex-col h-full">
          {/* Webinar Title */}
          <div className="flex items-start">
            <a
              href={webinar.url}
              target="_blank"
              rel="noopener noreferrer"
              className="header-cont flex items-center mb-2.5"
              onClick={(e) => e.stopPropagation()}
            >
              <h1 className="text-lg sm:text-xl font-semibold text-white line-clamp-2">
                {webinar.title}
              </h1>
            </a>
          </div>

          {/* Description with line-clamp */}
          <p className="text-xs sm:text-sm text-gray-400 mb-3 line-clamp-3 max-h-[3.9rem]">
            {webinar.description || "No description available."}
          </p>

          {/* Host and Timestamp */}
          <div className="flex flex-col mb-3">
            <span className="text-sm sm:text-base text-gray-300">
              <span className="font-semibold">Host:</span>{" "}
              <span className="text-gray-400">{webinar.host}</span>
            </span>
            <span className="text-sm sm:text-base text-[#7F89FF]">
              {webinar.timestamp}
            </span>
          </div>

          {/* Tags */}
          <ul className="flex flex-wrap gap-2 mt-2">
            {webinar.tags &&
              webinar.tags.split(",").map((tag, index) => (
                <li
                  key={index}
                  className="bg-[#7F89FF]/10 border border-[#7F89FF]/50 text-white text-[10px] sm:text-xs px-2 py-1 rounded-md uppercase"
                >
                  {tag.trim()}
                </li>
              ))}
          </ul>
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
