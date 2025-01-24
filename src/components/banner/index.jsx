import React from "react";
import { CiChat2, CiSearch } from "react-icons/ci";
import { IoLibraryOutline } from "react-icons/io5";
import { GiArtificialIntelligence } from "react-icons/gi";
import { FaGlobeAfrica } from "react-icons/fa";
import { GrCursor } from "react-icons/gr";
import { FaRegLightbulb } from "react-icons/fa";

const Banner = () => {
  return (
    <>
      <div className="w-full flex justify-center items-center p-0 bg-[#11111E] md:min-h-[35rem] min-h-[24rem] relative overflow-hidden">
        {/* Animated Icons */}
        {/* <CiChat2 className="icon-animation icon-1 text-5xl absolute" />
        <CiSearch className="icon-animation icon-2 text-5xl absolute" />
        <GiArtificialIntelligence className="icon-animation icon-3 text-5xl absolute" />
        <IoLibraryOutline className="icon-animation icon-4 text-5xl absolute" />
        <FaGlobeAfrica className="icon-animation icon-5 text-5xl absolute" />
        <GrCursor className="icon-animation icon-6 text-5xl absolute" />
        <FaRegLightbulb className="icon-animation icon-7 text-5xl absolute" /> */}

        {/* Text Content */}
        <div className="flex flex-col items-center justify-center px-4 relative z-10">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-white">
            {/* All GPTs Directory! */}
          </h1>
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl text-[#7F89FF] font-semibold text-center md:mb-5 mb-1">
            LLM Repo
          </h2>
          <p className="text-sm sm:text-base md:text-lg font-normal pt-2 text-center max-w-2xl text-white">
            Your Gateway to{" "}
            <span className="text-[#7F89FF] text-xl font-medium">
              LLM Tools, Libraries, and Learning
            </span>
            . Discover, explore, and{" "}
            <span className="text-[#7F89FF] text-xl font-medium">
              stay updated{" "}
            </span>{" "}
            with the{" "}
            <span className="text-[#7F89FF] text-xl font-medium">latest </span>{" "}
            LLM tools, libraries, and webinars to{" "}
            <span className="text-[#7F89FF] text-xl font-medium">
              {" "}
              build smarter AI solutions
            </span>
            .
          </p>
        </div>
      </div>

      {/* Styles */}
      <style jsx>{`
        .icon-animation {
          animation: scaleOpacity 3s ease-in-out infinite alternate,
            moveRandomly 5s ease-in-out infinite alternate;
        }

        /* Scaling and Opacity */
        @keyframes scaleOpacity {
          0% {
            transform: scale(1);
            opacity: 0.6;
          }
          50% {
            transform: scale(2);
            opacity: 0.2;
          }
          100% {
            transform: scale(1);
            opacity: 0.6;
          }
        }

        /* Random Translations */
        @keyframes moveRandomly {
          0% {
            transform: translate(0, 0);
          }
          10% {
            transform: translate(30vw, -30vh);
          }
          25% {
            transform: translate(25vw, 30vh);
          }
          50% {
            transform: translate(-30vw, 20vh);
          }
          60% {
              transform: translate(-25vw, 30vh);
          }
          75% {
            transform: translate(10vw, -20vh);
          }
          100% {
            transform: translate(0, 0);
          }
        }

        /* Adding delays for randomness */
        .icon-1 {
          animation-delay: 0s;
        }
        .icon-2 {
          animation-delay: 0.5s;
        }
        .icon-3 {
          animation-delay: 1s;
        }
        .icon-4 {
          animation-delay: 1.5s;
        }
        .icon-5 {
          animation-delay: 2s;
        }
        .icon-6 {
          animation-delay: 2.5s;
        }
        .icon-7 {
          animation-delay: 3s;
        }
      `}</style>
    </>
  );
};

export { Banner };
