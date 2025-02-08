import React from "react";
import { Meteors } from "../ui/meteors";

const Banner = () => {
  return (
    <>
      <div className="w-full flex justify-center items-center p-0 md:min-h-[40rem] min-h-[24rem] relative overflow-hidden">
        <div className=" w-full h-full">
          <Meteors number={60} />
        </div>
        <div className="flex flex-col items-center justify-center px-4 absolute z-10">
          {/* <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-white"></h1> */}
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
    </>
  );
};

export { Banner };
