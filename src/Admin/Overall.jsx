import React, { useState } from "react";
import Sidenavbar from "../Admin Utilities/sidenavbar";

export const OverallPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
      <div className="overall_parent">
  
        <button
          className="md:hidden p-2 bg-gray-800 text-white fixed top-4 left-4 rounded"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          ☰
        </button>


        <div
          className={`sidenavigation_parent ${
            isSidebarOpen ? "block" : "hidden"
          } md:block`}
        >
          <Sidenavbar />
        </div>


        <div className="content_area">
          <h1 className="text-xl font-bold">Overall</h1>
        </div>
      </div>
    </>
  );
};
