import React, { useState } from "react";
import logo from "../../../assets/images/llm_repo_logo.png";
import { Link } from "react-router-dom";
import { LLMForm, SiteWideModal } from "../..";

const Footer = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const links = [
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
    {
      name: "GPT",
      path: "/gpt",
    },
  ];

  return (
    <footer className="text-white py-16 px-4 sm:px-10 mt-auto bg-[#11111e]">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Column 1 - Company Info */}
        <div className="col-span-1 order-1">
          <Link to="/">
            <div className="flex flex-col items-center w-fit">
              <img
                src={logo}
                className="w-10 filter invert mb-0.5"
                alt="LLM Repo Logo"
              />
              <h2 className="text-xs">LLM Repo</h2>
            </div>
          </Link>
          <p className="text-gray-400 mt-2 text-sm">
            LLM Repo provides self-hosted software solutions tailored to your
            needs.
          </p>
          <p className="text-gray-500 mt-4 text-xs">
            © 2024 LLM Repo. All rights reserved.
          </p>
        </div>

        {/* Column 2 - Useful Links */}
        <div className="grid-cols-1 order-2">
          <div className="w-fit md:mx-auto">
            <h3 className="text-xl font-semibold mb-3">Useful Links</h3>
            <ul className="text-gray-400 space-y-2 w-fit">
              {links.map((link, id) => (
                <li key={id} className="w-full">
                  <Link
                    to={link.path}
                    className="hover:text-[#7f89ff] text-sm w-full block ease-in-out duration-150 transition-all text-gray-400"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Column 3 - Submit Your LLM */}
        <div className="grid-cols-1 order-3">
          <h3 className="text-xl font-semibold mb-3">Submit Your LLM</h3>
          <p className="text-gray-400 mb-4 text-sm">
            Contribute to the repository by submitting your own large language
            model.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-white duration-150 ease-in-out text-[#11111e] font-medium px-6 py-2 rounded-lg transition-all"
          >
            Submit
          </button>
        </div>
      </div>
      <SiteWideModal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        className="hidden"
      >
        <>
          <LLMForm />
        </>
      </SiteWideModal>
    </footer>
  );
};

export { Footer };
