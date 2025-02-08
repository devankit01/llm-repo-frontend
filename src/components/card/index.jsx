import React, { useState } from "react";
import { MdArrowOutward } from "react-icons/md";
import { FaRegBookmark, FaBookmark, FaArrowRight } from "react-icons/fa";
import { SiteWideModal } from "../modal";
import { useDispatch, useSelector } from "react-redux";
import { addBookmark, removeBookmark } from "../../redux/slice/bookmarkSlice";

const Card = ({ tool }) => {
  const [bookmark, setBookmark] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const dispatch = useDispatch();
  const bookmarks = useSelector((state) => state.bookmarks.llmTools || []);


  const bookmarkHandler = (e) => {
    e.stopPropagation();
    if (bookmarks.some((i) => i.id === tool.id)) {
      dispatch(removeBookmark({ category: "llmTools", itemId: tool.id }));
    } else {
      dispatch(addBookmark({ category: "llmTools", item: tool }));
    }
    setBookmark(!bookmark);
  };

  if (!tool) {
    return null;
  }

  const tagsArray = tool.tags ? tool.tags.split(",") : [];

  const openModal = () => {
    setModalContent(
      <div>
        <h2 className="text-lg font-bold mb-4">{tool.source}</h2>
        <p className="text-gray-400 text-sm mb-3">{tool.description}</p>
        <div className="tags flex flex-wrap gap-2 mb-8 left-0">
          {tagsArray.map((tag, index) => (
            <span
              key={index}
              className="bg-[#7F89FF]/10 border border-[#7F89FF]/50 text-white text-xs px-2 py-1 rounded-md uppercase"
            >
              {tag.trim()}
            </span>
          ))}
        </div>
        <a
          href={tool.link}
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
        onClick={openModal} 
      >
        <div className="absolute w-full flex justify-between items-center top-3 px-3">
          <span className="text-xs font-semibold text-[#7F89FF]">
            {tool.is_sponsor ? "SPONSORED" : ""}
          </span>

          <button
            onClick={(e) => bookmarkHandler(e)}
            className="w-8 h-8 grid place-items-center bg-[#202330] z-20 rounded-md opacity-50 hover:opacity-100 duration-300 transition-all ease-in-out"
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
        </div>

        {/* Content */}
        <div className="lower-part p-5 bg-gradient-to-t from-[#202330] to-transparent">
          {/* Source */}
          <div className="absolute top-12 left-0 px-5">
            <a
              href={tool.link}
              target="_blank"
              rel="noopener noreferrer"
              className="header-cont flex items-center mb-2.5 w-max"
              onClick={(e) => e.stopPropagation()} // Prevent card click from triggering modal
            >
              <h1 className="text-lg font-semibold">{tool.source}</h1>
              <MdArrowOutward
                fill="#7F89FF"
                className="group-hover:opacity-100 opacity-0 ease-in-out duration-300 transition-all text-lg ml-3"
              />
            </a>
            <div className="description text-xs line-clamp-4 text-gray-400">
              {tool.description}
            </div>
          </div>
          {/* Tags */}
          <div className="tags flex flex-wrap gap-2 mb-3 absolute bottom-0 left-0 px-5">
            {tagsArray.map((tag, index) => (
              <span
                key={index}
                className="bg-[#7F89FF]/10 border border-[#7F89FF]/50 text-white text-[10px] px-2 py-1 rounded-md uppercase"
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

export { Card };
