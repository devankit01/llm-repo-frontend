import React, { useEffect, useState } from "react";
import { FaSearch, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { setSearchText, setTag } from "../../redux/slice/filterSlice";
import { useLocation } from "react-router-dom";

const Filter = () => {
  const location = useLocation().pathname;
  const [enteredSearchText, setEnteredSearchText] = useState("");
  const [showAllTags, setShowAllTags] = useState(false);
  const [isTagsVisible, setIsTagsVisible] = useState(true);
  const [tags, setTags] = useState([]);
  const tagList = useSelector((state) => state.filter.tags);
  const { llmtool, gpt, llmlibrary } = useSelector((state) => state.filter);
  const dispatch = useDispatch();

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setEnteredSearchText(value);
    if (enteredSearchText === "") dispatch(setSearchText(""));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(setSearchText(enteredSearchText.toLowerCase()));
  };

  const handleClearAll = () => {
    setEnteredSearchText("");
    dispatch(setSearchText(""));
  };

  const handleTagClick = (tagName) => {
    dispatch(setTag(tagName.toLowerCase()));
  };

  const extractUniqueTags = (data, separator) => {
    const allTags = data.flatMap((item) => {
      const tags = location === "/gpt" ? item.category : item.tags;
      if (!tags || tags.trim() === "") return;
      return tags
        .split(separator)
        .map((tag) => tag.trim())
        .filter((tag) => tag);
    });
    return [...new Set(allTags)];
  };

  useEffect(() => {
    location === "/llm-tools"
      ? setTags(extractUniqueTags(llmtool, ","))
      : location === "/llm-library"
      ? setTags(extractUniqueTags(llmlibrary, ";"))
      : setTags(extractUniqueTags(gpt, ";"));
  }, [location, llmtool, llmlibrary, gpt]);

  console.log(tagList);

  return (
    <section className="bg-[#202330] py-8 px-5 lg:h-[88.5vh] lg:overflow-y-scroll w-full lg:rounded-none rounded-xl">
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
                {(showAllTags ? tags : tags.slice(0, 10)).map(
                  (tag, i) =>
                    tag !== undefined && (
                      <li
                        key={i}
                        onClick={() => handleTagClick(tag)}
                        className={`border border-gray-600 px-3 py-1 rounded-md text-xs cursor-pointer ease-in-out duration-200 transition-all
                    ${
                      tagList.includes(tag.toLowerCase())
                        ? "bg-[#7F89FF]/5 text-[#7F89FF] border-[#7F89FF]"
                        : "hover:text-[#7F89FF] hover:bg-[#7F89FF]/5 hover:border-[#7F89FF]"
                    }`}
                      >
                        {tag?.toUpperCase()}
                      </li>
                    )
                )}
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
