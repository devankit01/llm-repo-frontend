import React, { useState } from "react";
import { Link } from "react-router-dom";
import { IoMenu, IoClose } from "react-icons/io5";
import { IoIosArrowDown } from "react-icons/io";
import { SiteWideModal } from "../../modal";
import logo from "../../../assets/images/llm_repo_logo.png";

const Navbar = () => {
  const [toggle, setToggle] = useState(false); // Main menu toggle
  const [showSubLinks, setShowSubLinks] = useState(false); // Toggle for LLM sublinks
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state management

  const links = [
    {
      name: "LLM",
      path: "",
      subLink: [
        {
          name: "LLM Tools",
          path: "/llm-tools",
        },
        {
          name: "LLM Libraries",
          path: "/llm-library",
        },
        {
          name: "LLM Courses",
          path: "/llm-courses",
        },
        {
          name: "LLM Webinars",
          path: "/llm-webinars",
        },
      ],
    },
    {
      name: "GPT",
      path: "/gpt",
      subLink: [],
    },
    {
      name: "Bookmarks",
      path: "/bookmarks",
      subLink: [],
    },
  ];

  const modalContent = (
    <form className="space-y-4">
      <input
        type="text"
        placeholder="Name"
        className="w-full bg-[#11111e] px-4 py-2.5 rounded-xl border border-transparent outline-none hover:border-[#7F89FF] focus:border-[#7F89FF] ease-in-out duration-200 transition-all placeholder:text-[#888]"
      />
      <input
        type="email"
        placeholder="Email"
        className="w-full bg-[#11111e] px-4 py-2.5 rounded-xl border border-transparent outline-none hover:border-[#7F89FF] focus:border-[#7F89FF] ease-in-out duration-200 transition-all placeholder:text-[#888]"
      />
      <input
        type="text"
        placeholder="Message"
        className="w-full bg-[#11111e] px-4 py-2.5 rounded-xl border border-transparent outline-none hover:border-[#7F89FF] focus:border-[#7F89FF] ease-in-out duration-200 transition-all placeholder:text-[#888]"
      />
      <input
        type="url"
        placeholder="Link"
        className="w-full bg-[#11111e] px-4 py-2.5 rounded-xl border border-transparent outline-none hover:border-[#7F89FF] focus:border-[#7F89FF] ease-in-out duration-200 transition-all placeholder:text-[#888]"
      />
      <button
        type="submit"
        className="w-full bg-[#7F89FF] text-[#11111e] px-4 py-2.5 rounded-xl font-semibold transition-all duration-200 hover:opacity-90"
      >
        Submit
      </button>
    </form>
  );

  return (
    <>
      <nav className="w-screen flex items-center justify-center !bg-[#202330] shadow shadow-black/30 border-b border-b-[#202330] fixed z-50">
        <div className="mx-auto max-w-[100rem] w-full px-[3%] py-3 text-white flex items-center justify-between">
          {/* Logo */}
          <div className="logo z-50">
            <Link to="/" onClick={() => setToggle(false)}>
              <div className="innerlogo flex flex-col items-center">
                <img src={logo} className="w-10 filter invert mb-0.5" alt="" />
                <span className="text-xs">LLM Repo</span>
              </div>
            </Link>
          </div>

          {/* Links */}
          <ul
            className={`${
              toggle
                ? "visible opacity-100"
                : "sm:visible invisible sm:opacity-100 opacity-0"
            } flex sm:flex-row flex-col items-center sm:justify-between justify-center gap-x-2 sm:space-y-0 space-y-3 text-sm sm:relative absolute left-0 top-0 sm:w-auto w-full sm:min-h-full min-h-screen sm:px-0 px-5 sm:bg-transparent bg-[#11111e] ease-in-out transition-all duration-200`}
          >
            {links.map((link) => (
              <li key={link.path} className="group">
                {/* Check if the link has sublinks */}
                {link.subLink.length ? (
                  <>
                    <div
                      className={`cursor-pointer hover:bg-white/10 duration-200 ease-in-out transition-all px-7 py-3.5 font-semibold rounded-lg block relative sm:flex sm:items-center ${
                        showSubLinks && toggle
                          ? "bg-[#11111e] sm:bg-transparent"
                          : ""
                      }`}
                      onClick={() => toggle && setShowSubLinks(!showSubLinks)} // Toggle dropdown in small screens
                    >
                      <span className="flex items-center">
                        {link.name}{" "}
                        <IoIosArrowDown
                          className={`ml-1.5 ${
                            showSubLinks && toggle ? "rotate-180" : "rotate-0"
                          } transition-transform duration-200`}
                        />
                      </span>

                      {/* Sublinks */}
                      <div
                        className={`sublist ${
                          showSubLinks && toggle ? "block" : "hidden"
                        } sm:group-hover:block sm:absolute sm:top-12 sm:left-0 sm:bg-[#202330] sm:rounded-lg sm:w-max sm:overflow-hidden sm:shadow sm:shadow-black/30 sm:opacity-0 sm:invisible sm:group-hover:opacity-100 sm:group-hover:visible ease-in-out sm:duration-200 sm:transition-all`}
                      >
                        <ul
                          className={`${toggle ? "block" : "hidden"} sm:block`}
                        >
                          {link.subLink.map((sublink) => (
                            <li key={sublink.name} className="w-full">
                              <Link
                                to={sublink.path}
                                className="block px-10 py-2.5 hover:bg-white/10 duration-200 ease-in-out transition-all"
                                onClick={() => setToggle(false)}
                              >
                                {sublink.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </>
                ) : (
                  // Normal Links
                  <Link
                    to={link.path}
                    onClick={() => setToggle(false)}
                    className="px-7 py-3.5 font-semibold rounded-lg block hover:bg-white/10 duration-200 ease-in-out transition-all"
                  >
                    {link.name}
                  </Link>
                )}
              </li>
            ))}
            <li>
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-7 py-3.5 font-semibold rounded-lg block bg-white text-[#202330]"
              >
                Submit
              </button>
            </li>
          </ul>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setToggle(!toggle)}
            className="toggle text-2xl w-10 h-10 rounded-full sm:hidden grid place-items-center border border-white/5 bg-[#11111e] shadow-sm shadow-[#7F89FF] relative text-[#2e2f33]"
          >
            <IoMenu className={toggle ? "hidden" : "block"} />
            <IoClose className={toggle ? "block" : "hidden"} />
          </button>
        </div>
      </nav>

      {/* SiteWideModal */}
      <SiteWideModal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        className="hidden"
      >
        {modalContent}
      </SiteWideModal>
    </>
  );
};

export { Navbar };
