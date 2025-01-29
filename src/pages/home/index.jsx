import React from "react";
import { LLMTools } from "../../components/llm-tools";
import {
  Banner,
  WebinarSection,
  CourseSection,
  LibrarySection,
} from "../../components";

const Home = () => {
  return (
    <>
      <section className="min-h-screen max-w-[100rem] mx-auto w-full">
        <Banner />
        <div className="py-16 md:px-10 px-3 ">
          <LLMTools />
          <LibrarySection />
          <CourseSection />
          <WebinarSection />
        </div>
      </section>
    </>
  );
};

export { Home };
