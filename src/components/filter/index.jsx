import React, { useState } from "react";
import { FaSearch, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { performLLMSearch, setSearchText } from "../../redux/slice/filterSlice";

const Filter = () => {
  const [enteredSearchText, setEnteredSearchText] = useState("");
  const [showAllTags, setShowAllTags] = useState(false);
  const [isTagsVisible, setIsTagsVisible] = useState(true);

  const location = useLocation().pathname;
  const dispatch = useDispatch();
  const { searchText } = useSelector((state) => state.filter);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setEnteredSearchText(value);
    if (enteredSearchText === "") dispatch(setSearchText(""));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(setSearchText(enteredSearchText));
  };

  const handleClearAll = () => {
    setEnteredSearchText("");
    dispatch(setSearchText(""));
  };

  const tags = [
    { id: 1, name: "algorithm" },
    { id: 2, name: "binary" },
    { id: 3, name: "cache" },
    { id: 4, name: "cloud" },
    { id: 5, name: "compiler" },
    { id: 6, name: "cyberspace" },
    { id: 7, name: "database" },
    { id: 8, name: "debug" },
    { id: 9, name: "encryption" },
    { id: 10, name: "framework" },
    { id: 11, name: "frontend" },
    { id: 12, name: "gateway" },
    { id: 13, name: "hash" },
    { id: 14, name: "index" },
    { id: 15, name: "iteration" },
    { id: 16, name: "kernel" },
    { id: 17, name: "latency" },
    { id: 18, name: "machine" },
    { id: 19, name: "neural" },
    { id: 20, name: "network" },
    { id: 21, name: "object" },
    { id: 22, name: "optimize" },
    { id: 23, name: "packet" },
    { id: 24, name: "protocol" },
    { id: 25, name: "query" },
    { id: 26, name: "recursion" },
    { id: 27, name: "repository" },
    { id: 28, name: "runtime" },
    { id: 29, name: "scalability" },
    { id: 30, name: "schema" },
    { id: 31, name: "stack" },
    { id: 32, name: "syntax" },
    { id: 33, name: "thread" },
    { id: 34, name: "token" },
    { id: 35, name: "virtualization" },
    { id: 36, name: "websocket" },
    { id: 37, name: "workflow" },
    { id: 38, name: "dataflow" },
    { id: 39, name: "pipeline" },
    { id: 40, name: "bytecode" },
    { id: 41, name: "API" },
    { id: 42, name: "authentication" },
    { id: 43, name: "authorization" },
    { id: 44, name: "backpropagation" },
    { id: 45, name: "blockchain" },
    { id: 46, name: "bot" },
    { id: 47, name: "buffer" },
    { id: 48, name: "cipher" },
    { id: 49, name: "containerization" },
    { id: 50, name: "controller" },
    { id: 51, name: "cookie" },
    { id: 52, name: "crawler" },
    { id: 53, name: "cryptography" },
    { id: 54, name: "daemon" },
    { id: 55, name: "data" },
    { id: 56, name: "datacenter" },
    { id: 57, name: "deployment" },
    { id: 58, name: "devops" },
    { id: 59, name: "domain" },
    { id: 60, name: "emulator" },
    { id: 61, name: "firewall" },
    { id: 62, name: "firmware" },
    { id: 63, name: "GPU" },
    { id: 64, name: "hypervisor" },
    { id: 65, name: "IDE" },
    { id: 66, name: "inheritance" },
    { id: 67, name: "integrity" },
    { id: 68, name: "IoT" },
    { id: 69, name: "keypair" },
    { id: 70, name: "latency" },
    { id: 71, name: "loadbalancer" },
    { id: 72, name: "metadata" },
    { id: 73, name: "middleware" },
    { id: 74, name: "minification" },
    { id: 75, name: "modem" },
    { id: 76, name: "node" },
    { id: 77, name: "open-source" },
    { id: 78, name: "parsing" },
    { id: 79, name: "patch" },
    { id: 80, name: "port" },
    { id: 81, name: "pseudocode" },
    { id: 82, name: "quantum" },
    { id: 83, name: "rendering" },
    { id: 84, name: "sandbox" },
    { id: 85, name: "SDK" },
    { id: 86, name: "serverless" },
    { id: 87, name: "sharding" },
    { id: 88, name: "singleton" },
    { id: 89, name: "SSL" },
    { id: 90, name: "transpiler" },
  ];

  return (
    <section className="bg-[#202330] py-8 px-5 lg:h-[88.5vh] lg:overflow-y-scroll w-full lg:rounded-none rounded-xl">
      {/* Search Bar */}
      <div className="">
        <form
          className="search flex items-center relative mb-5"
          onSubmit={handleSubmit}
        >
          <FaSearch fill="#888" className="absolute left-3" />
          <input
            type="text"
            name="search"
            value={enteredSearchText}
            onChange={handleSearchChange}
            placeholder="Search"
            className="w-full bg-[#11111e] pr-4 pl-10 py-2.5 rounded-xl border border-transparent outline-none hover:border-[#7F89FF] focus:border-[#7F89FF] ease-in-out duration-200 transition-all placeholder:text-[#888]"
          />
        </form>
      </div>

      {/* Filter Header */}
      <div className="other-filter">
        <div className="header flex items-center justify-between mb-5 px-2 py-3 border-b border-b-[#11111e]">
          <h1 className="text-lg font-semibold">Filter</h1>
          <button
            onClick={handleClearAll}
            className="text-sm text-[#7F89FF] font-medium"
          >
            Clear All
          </button>
        </div>

        <div className="tags mt-5">
          <div className="flex justify-between items-center">
            <h2 className="text-lg text-white mb-3">Tags</h2>
            <div
              className="cursor-pointer text-[#7F89FF]"
              onClick={() => setIsTagsVisible(!isTagsVisible)}
            >
              {isTagsVisible ? (
                <FaChevronUp size={16} />
              ) : (
                <FaChevronDown size={16} />
              )}
            </div>
          </div>

          {isTagsVisible && (
            <div>
              <ul className="flex flex-wrap gap-x-2 gap-y-2">
                {(showAllTags ? tags : tags.slice(0, 10)).map((tag) => (
                  <li
                    key={tag.id}
                    className="border border-gray-600 px-3 py-1 rounded-md text-sm cursor-pointer hover:text-[#7F89FF] hover:bg-[#7F89FF]/5 hover:border-[#7F89FF] ease-in-out duration-200 transition-all"
                  >
                    {tag?.name?.toUpperCase()}
                  </li>
                ))}
              </ul>

              <button
                className="text-sm text-[#7F89FF] font-medium mt-2"
                onClick={() => setShowAllTags(!showAllTags)}
              >
                {showAllTags ? "Show Less" : "Show More"}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export { Filter };
