import React, { useState } from "react";
import { MdArrowOutward } from "react-icons/md";
import { FaRegBookmark, FaBookmark, FaArrowRight } from "react-icons/fa";
import { SiteWideModal } from "../modal";

const GPTCard = ({ tool }) => {
  const [bookmark, setBookmark] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);

  const bookmarkHandler = (e) => {
    e.stopPropagation();
    setBookmark(!bookmark);
  };

  if (!tool) {
    return null;
  }

  const categoriesArray = tool.category ? tool.category.split(";") : [];

  const openModal = () => {
    setModalContent(
      <div>
        <h2 className="text-lg font-bold mb-4">{tool.title}</h2>
        <p className="text-gray-400 text-sm mb-3">{tool.description}</p>
        <div className="tags flex flex-wrap gap-2 mb-8 left-0">
          {categoriesArray.map((category, index) => (
            <span
              key={index}
              className="bg-[#7F89FF]/10 border border-[#7F89FF]/50 text-white text-xs px-2 py-1 rounded-md"
            >
              {category.trim()}
            </span>
          ))}
        </div>
        <a
          href={tool.url}
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
      <div
        className="border border-transparent hover:border-[#7F89FF] bg-[#202330] rounded-xl hover:scale-[1.02] ease-in-out duration-300 transition-all w-full h-[11rem] relative overflow-hidden group cursor-pointer"
        onClick={openModal}
      >
        {/* <button
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
        </button> */}

        <div className="lower-part p-5 bg-gradient-to-t from-[#202330] to-transparent w-full">
          <div className="absolute top-6 left-0 px-5 w-full">
            <a
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              className="header-cont flex items-center mb-2"
              onClick={(e) => e.stopPropagation()}
            >
              <h1 className="text-lg font-semibold whitespace-normal break-words">
                {tool.title}
              </h1>
              <MdArrowOutward
                fill="#7F89FF"
                className="group-hover:opacity-100 opacity-0 ease-in-out duration-300 transition-all text-lg ml-3"
              />
            </a>
            <div className="description text-xs text-gray-400 w-full whitespace-normal break-words line-clamp-4">
              {tool.text}
            </div>
          </div>
          <div className="tags flex flex-wrap gap-2 mb-3 absolute bottom-0 left-0 px-5">
            {categoriesArray.map((category, index) => (
              <span
                key={index}
                className="bg-[#7F89FF]/10 border border-[#7F89FF]/50 text-white text-[10px] px-2 py-1 rounded-md uppercase"
              >
                {category.trim()}
              </span>
            ))}
          </div>
        </div>
      </div>

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

export { GPTCard };
