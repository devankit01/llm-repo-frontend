import { toast } from "react-toastify";
import { toolSubmit } from "../../api/apiCall";
import React, { useState } from "react";
import "react-toastify/dist/ReactToastify.css";

const LLMForm = () => {
  const error = (message)=>{
    toast.error(message, {
      hideProgressBar: true,
      style: { backgroundColor: "#fff", color: "#000" },
    });
  }

  const success = (message)=>{
    toast.success(message, {
      hideProgressBar: true,
      style: { backgroundColor: "#fff", color: "#000" },
    });
  }
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    body: {
      toolLink: "",
      message: "",
    },
  });

  const [loading, setLoading] = useState(false);

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "toolLink" || name === "message") {
      setFormData((prevData) => ({
        ...prevData,
        body: {
          ...prevData.body,
          [name]: value,
        },
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  // Handle Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { name, email, body } = formData;

    if (!name || !email || !body.toolLink || !body.message) {
      error("All fields are required!!")
      setLoading(false);
      return;
    }

    try {
      await toolSubmit({
        subject: name,
        recipient_email: email,
        body: JSON.stringify(body),
      });
      success("Form submitted successfully!")
      setFormData({
        name: "",
        email: "",
        body: {
          toolLink: "",
          message: "",
        },
      });
    } catch (err) {
     error("Failed to submit form!!")
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="">
      <h1 className="text-2xl sm:text-3xl md:text-5xl font-semibold mb-3 md:mb-10 text-center">
        Submit your LLM
      </h1>
      <div className="frm-container mb-5">
        <div className="element mb-4">
          <label className="text-[#888]">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="John Doe"
            className="w-full bg-[#11111e] px-4 py-2.5 rounded-xl border border-transparent outline-none hover:border-[#7F89FF] focus:border-[#7F89FF] ease-in-out duration-200 transition-all placeholder:text-[#444]"
          />
        </div>
        <div className="element mb-4">
          <label className="text-[#888]">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="john.doe@gmail.com"
            className="w-full bg-[#11111e] px-4 py-2.5 rounded-xl border border-transparent outline-none hover:border-[#7F89FF] focus:border-[#7F89FF] ease-in-out duration-200 transition-all placeholder:text-[#444]"
          />
        </div>
        <div className="element mb-4">
          <label className="text-[#888]">Tool Link</label>
          <input
            type="url"
            name="toolLink"
            value={formData.body.toolLink}
            onChange={handleChange}
            placeholder="https://johndoe.ai"
            className="w-full bg-[#11111e] px-4 py-2.5 rounded-xl border border-transparent outline-none hover:border-[#7F89FF] focus:border-[#7F89FF] ease-in-out duration-200 transition-all placeholder:text-[#444]"
          />
        </div>
        <div className="element mb-4">
          <label className="text-[#888]">Message</label>
          <textarea
            name="message"
            value={formData.body.message}
            onChange={handleChange}
            placeholder="Message"
            rows={2}
            className="w-full bg-[#11111e] px-4 py-2.5 rounded-xl border border-transparent outline-none hover:border-[#7F89FF] focus:border-[#7F89FF] ease-in-out duration-200 transition-all placeholder:text-[#444] resize-none"
          ></textarea>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 block bg-white text-[#202330] rounded-xl font-semibold transition-all duration-200 hover:opacity-90"
        >
          {loading ? (
            <div className="flex justify-center items-center">
              <div className="w-6 h-6 border-3 border-t-transparent border-black rounded-full animate-spin"></div>
            </div>
          ) : (
            "Submit"
          )}
        </button>
      </div>
    </form>
  );
};

export { LLMForm };
