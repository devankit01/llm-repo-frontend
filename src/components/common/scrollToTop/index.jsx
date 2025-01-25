import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { FaArrowUp } from "react-icons/fa";

const ScrollToTop = () => {
  const topRef = useRef(null);
  const { pathname } = useLocation();

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  useEffect(() => {
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [pathname]);

  return (
    <>
      <div ref={topRef} className=" fixed top-0 left-0 z-[1000]" />
      <button
        onClick={handleScrollToTop}
        className="fixed right-10 bottom-10 bg-[#7f89ff] text-[#11111e] w-10 h-10 flex justify-center items-center rounded-md z-[1000]"
      >
        <FaArrowUp className=" text-lg" fill="#11111e" />
      </button>
    </>
  );
};

export { ScrollToTop };
