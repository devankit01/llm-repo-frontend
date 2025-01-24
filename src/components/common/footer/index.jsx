import React from "react";
import logo from "../../../assets/images/llm_repo_logo.png";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="text-white py-16 px-4 sm:px-10 mt-auto">
      <div className="max-w-4xl mx-auto text-center sm:text-left">
        {/* Mailing List Section */}
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
          Join Our Mailing List
        </h2>
        <p className="text-gray-400 mb-6">
          Stay in the loop with our monthly newsletter and be the first to know
          about new{" "}
          <span className="text-white font-semibold">self-hosted software</span>
          . We promise, no spam, just valuable updates.
        </p>
        {/* Email Input and Button */}
        <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-4">
          <input
            type="email"
            placeholder="your@email.com"
            className="bg-[#1c1c3a] text-white px-4 py-2 rounded-lg w-full sm:w-auto flex-1 outline-none focus:ring-2 focus:ring-[#7f89ff] transition-all"
          />
          <button className="bg-[#7f89ff] text-[#11111e] font-medium px-6 py-2 rounded-lg hover:bg-[#6d7ae6] transition-all">
            Sign Up →
          </button>
        </div>
        <p className="text-gray-500 mt-4 text-sm">
          We respect your privacy and take protecting it seriously.
        </p>
      </div>

      {/* Footer Bottom Section */}
      <div className="mt-10 flex flex-col sm:flex-row items-center justify-between text-gray-500 text-sm">
        <Link to="/">
          <div className="innerlogo flex flex-col items-center">
            <img src={logo} className="w-10 filter invert mb-0.5" alt="" />
            <span className="text-xs">LLM Repo</span>
          </div>
        </Link>
        {/* <p>© 2024 Directory template</p> */}
      </div>
    </footer>
  );
};

export { Footer };
