import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Egg,
  Bug,
  Users,
  Monitor,
  Smartphone,
  Box,
  PieChart,
  Beef,
  Package,
  Notebook,
  Wheat,
  Flower2,
  Trash,
} from "lucide-react";

import BioFlytLogo from "../assets/bioflyt logo full 1.svg";

const Sidenavbar = () => {
  const [active, setActive] = useState("Analytics");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  // Close sidebar on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        isSidebarOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(e.target)
      ) {
        setIsSidebarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isSidebarOpen]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navItems = [
    {
      label: "Analytics",
      icon: <PieChart className="w-5 h-5" />,
      path: "/Analytics",
    },
    {
      label: "BSF Eggs Input",
      icon: <Egg className="w-5 h-5" />,
      path: "/Eggs",
    },
    {
      label: "BSF Larvae / Pupae Input",
      icon: <Bug className="w-5 h-5" />,
      path: "/Larvae",
    },
    {
      label: "Employee Management",
      icon: <Users className="w-5 h-5" />,
      path: "/EmployeeManagement",
    },
    {
      label: "Employee Monitoring",
      icon: <Monitor className="w-5 h-5" />,
      path: "/EmployeeMonitoring",
    },

    {
      label: "BioFlyt Products",
      icon: <Box className="w-5 h-5" />,
      path: "/prod",
    },
    {
      label: "Food Waste",
      icon: <Beef className="w-5 h-5" />,
      path: "/foodwaste",
    },
    {
      label: "Pellets Input",
      icon: <Wheat className="w-5 h-5" />,
      path: "/pellets",
    },
    {
      label: "Fertilizer Input",
      icon: <Flower2 className="w-5 h-5" />,
      path: "/fertilizer",
    },
    {
      label: "Exports",
      icon: <Package className="w-5 h-5" />,
      path: "/exportprods",
    },
    {
      label: "In-House Waste",
      icon: <Trash className="w-5 h-5" />,
      path: "/inhouse",
    },
    { label: "Remarks", icon: <Notebook className="w-5 h-5" />, path: "/misc" },
    
  ];

  return (
    <>
      <div className="h-screen">
        {/* Hamburger Button */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          type="button"
          className="z-50 inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
        >
          <span className="sr-only">Open sidebar</span>
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path
              clipRule="evenodd"
              fillRule="evenodd"
              d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
            />
          </svg>
        </button>

        {/* Overlay (for small screens) */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          ref={sidebarRef}
          className={`fixed z-50 top-0 left-0 h-full w-64 bg-white transition-transform duration-300 ease-in-out transform ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0 lg:relative lg:z-0`}
        >
          <div className="h-full px-3 py-4 overflow-y-auto">
            <ul className="space-y-2 font-medium">
              {/* Dynamic Nav Items */}
              <nav className="space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.label}
                    to={item.path}
                    onClick={() => setIsSidebarOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-green-100 dark:hover:bg-green-700 transition"
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                ))}
              </nav>
            </ul>

            <div className="relative inline-block text-left" ref={dropdownRef}>
              {/* Button */}
              <button
                onClick={() => setIsOpen((prev) => !prev)}
                type="button"
                className="text-white  focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 inline-flex items-center text-black"
              >
                Bioflyt Mobile App
                <svg
                  className="w-2.5 h-2.5 ml-2"
                  aria-hidden="true"
                  fill="none"
                  viewBox="0 0 10 6"
                >
                  <path
                    d="M1 1L5 5L9 1"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              {/* Dropdown content */}
              {isOpen && (
                <div className="absolute z-10 mt-2 w-44 bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700">
                  <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                    <li>
                      <Link
                        to="/MobileApp"
                        className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                      >
                        <Smartphone className="w-5 h-5" />
                        <span className="ml-3">Mobile App Dashboard</span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/addvideotomobile"
                        className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                      >
                        <Smartphone className="w-5 h-5" />
                        <span className="ml-3">Add Video to Mobile</span>
                      </Link>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                      >
                        Earnings
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                      >
                        Sign out
                      </a>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </aside>
      </div>
    </>
    // <div className="h-screen w-64 bg-white border-r shadow-lg fixed flex flex-col">
    //   <div className="flex items-center px-6 py-4 border-b">
    //     <img src={BioFlytLogo} alt="BioFlyt Logo" className="h-10 mr-3" />
    //     <span className="text-xl font-black text-green-500">Admin Dashboard</span>
    //   </div>
    //   <nav className="flex-1 px-4 py-6 space-y-2">
    //     {navItems.map((item) => (
    //       <Link
    //         key={item.label}
    //         to={item.path}
    //         onClick={() => setActive(item.label)}
    //         className={`flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-green-100 transition ${
    //           active === item.label ? "bg-green-200 font-medium" : ""
    //         }`}
    //       >
    //         {item.icon}
    //         <span>{item.label}</span>
    //       </Link>
    //     ))}
    //   </nav>
    // </div>
  );
};

export default Sidenavbar;
