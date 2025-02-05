import React, { useState } from "react";
import { MdArrowOutward } from "react-icons/md";
import { FaRegBookmark, FaBookmark, FaArrowRight } from "react-icons/fa";
import { SiteWideModal } from "../modal";

const LibraryCard = ({ library }) => {
  const [bookmark, setBookmark] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);

  const bookmarkHandler = (e) => {
    e.stopPropagation(); // Stop the card click from opening the modal
    setBookmark(!bookmark);
  };

  if (!library) {
    return null;
  }

  const tagsArray = library.tags ? library.tags.split(";") : [];

  const openModal = () => {
    // Set the content of the modal dynamically based on the card clicked
    setModalContent(
      <div>
        {/* <h2 className="text-lg font-bold mb-4">{library.name}</h2> */}
        <p className="text-gray-400 text-sm mb-3">{library.description}</p>
        <div className="tags flex flex-wrap gap-2 mb-8 left-0">
          {tagsArray.map((tag, index) => (
            <span
              key={index}
              className="bg-[#7F89FF]/10 border border-[#7F89FF]/50 text-white text-xs px-2 py-1 rounded-md"
            >
              {tag.trim()}
            </span>
          ))}
        </div>
        <a
          href={library.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#11111e] px-5 py-2 border border-[#7F89FF] bg-[#7F89FF] font-medium rounded-lg flex items-center w-max"
        >
          Visit Source <FaArrowRight fill="#11111e" className="ml-2" />
        </a>
      </div>
    );
    setIsModalOpen(true);
  };

  return (
    <div>
      {/* Card */}
      <div
        className="border border-transparent hover:border-[#7F89FF] bg-[#202330] rounded-xl hover:scale-[1.02] ease-in-out duration-300 transition-all w-full h-[19rem] relative overflow-hidden group cursor-pointer"
        onClick={openModal} // Open the modal with updated content
      >
        {/* Bookmark Button */}
        <button
          onClick={(e) => bookmarkHandler(e)}
          className="absolute w-8 h-8 right-3 top-3 grid place-items-center bg-[#202330] z-20 rounded-md opacity-50 hover:opacity-100 duration-300 transition-all ease-in-out"
        >
          <FaRegBookmark
            fill="#7F89FF"
            className={`${bookmark ? "hidden" : "block"} absolute`}
          />
          <FaBookmark
            fill="#7F89FF"
            className={`${bookmark ? "block" : "hidden"} absolute`}
          />
        </button>

        {/* Content */}
        <div className="lower-part p-5 bg-gradient-to-t from-[#202330] to-transparent">
          {/* Title */}
          <div className="absolute top-12 left-0 px-5">
            <a
              href={library.url}
              target="_blank"
              rel="noopener noreferrer"
              className="header-cont flex items-center mb-2.5"
              onClick={(e) => e.stopPropagation()} // Prevent card click from triggering modal
            >
              <h1 className="text-lg font-semibold line-clamp-2">
                {library?.name}
              </h1>
              <MdArrowOutward
                fill="#7F89FF"
                className="group-hover:opacity-100 opacity-0 ease-in-out duration-300 transition-all text-lg ml-3"
              />
            </a>
            <div className="description text-xs line-clamp-4 text-gray-400">
              {library.description}
            </div>
          </div>
          {/* Tags */}
          <div className="tags flex flex-wrap gap-2 mb-3 absolute bottom-0 left-0 px-5">
            {tagsArray.map((tag, index) => (
              <span
                key={index}
                className="bg-[#7F89FF]/10 border border-[#7F89FF]/50 text-white text-[10px] px-2 py-1 rounded-md"
              >
                {tag.trim()}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* SiteWideModal */}
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

export { LibraryCard };
