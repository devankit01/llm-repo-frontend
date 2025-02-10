import React, { useState } from "react";
import { Meteors } from "../ui/meteors";
import { Particles } from "../ui/particles";

const Banner = () => {
  const [color, setColor] = useState("#ffffff");
  return (
    <>
      <div
        className={`w-full flex justify-center items-center p-0 min-h-screen relative`}
      >
        <div className="w-full h-full">
          <Particles
            className="absolute inset-0 z-0"
            staticity={100}
            quantity={100}
            ease={80}
            color={color}
            refresh
          />
        </div>
        <div className=" w-full h-full absolute right-[20%]">
          <Meteors number={20} />
        </div>
        <div className="flex flex-col items-center justify-center px-4 absolute z-10">
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl text-[#7F89FF] font-semibold text-center md:mb-5 mb-1 backdrop-blur-[1px] bg-[#11111e]">
            LLM Repo
          </h2>
          <p className="text-sm sm:text-base md:text-lg font-normal pt-2 text-center max-w-2xl text-white bg-[#11111e]">
            Your Gateway to{" "}
            <span className="text-[#7F89FF] text-base sm:text-lg md:text-xl font-medium">
              LLM Tools, Libraries, and Learning
            </span>
            . Discover, explore, and{" "}
            <span className="text-[#7F89FF] text-base sm:text-lg md:text-xl font-medium">
              stay updated{" "}
            </span>{" "}
            with the{" "}
            <span className="text-[#7F89FF] text-base sm:text-lg md:text-xl font-medium">
              latest{" "}
            </span>{" "}
            LLM tools, libraries, and webinars to{" "}
            <span className="text-[#7F89FF] text-base sm:text-lg md:text-xl font-medium">
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
