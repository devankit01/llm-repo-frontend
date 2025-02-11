import React, { useRef, useEffect } from "react";
import { IoClose } from "react-icons/io5";

const SiteWideModal = ({ isOpen, setIsOpen, children, className = "" }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        closeModal();
      }
    };

    if (isOpen) {
      window.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const closeModal = () => {
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 px-2.5 py-5">
      <div
        className="bg-[#202330] lg:p-6 p-4 rounded-lg max-w-2xl w-full shadow-lg max-h-screen h-auto overflow-y-auto relative"
        ref={modalRef}
      >
        {/* <button
          onClick={closeModal}
          className="text-gray-500 text-xl fixed right-[32%]"
        >
          <IoClose />
        </button> */}

        <div className="text-white">{children}</div>
      </div>
    </div>
  );
};

export { SiteWideModal };
