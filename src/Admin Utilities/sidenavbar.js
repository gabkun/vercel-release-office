import React, { useState, useRef, useEffect } from "react";
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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const navItems = [
    { label: "Analytics", icon: <PieChart className="w-5 h-5" />, path: "/Analytics" },
    { label: "BSF Eggs Input", icon: <Egg className="w-5 h-5" />, path: "/Eggs" },
    { label: "BSF Larvae / Pupae Input", icon: <Bug className="w-5 h-5" />, path: "/Larvae" },
    { label: "Employee Management", icon: <Users className="w-5 h-5" />, path: "/EmployeeManagement" },
    { label: "Employee Monitoring", icon: <Monitor className="w-5 h-5" />, path: "/EmployeeMonitoring" },
    { label: "BioFlyt Products", icon: <Box className="w-5 h-5" />, path: "/prod" },
    { label: "Food Waste", icon: <Beef className="w-5 h-5" />, path: "/foodwaste" },
    { label: "Pellets Input", icon: <Wheat className="w-5 h-5" />, path: "/pellets" },
    { label: "Fertilizer Input", icon: <Flower2 className="w-5 h-5" />, path: "/fertilizer" },
    { label: "Exports", icon: <Package className="w-5 h-5" />, path: "/exportprods" },
    { label: "In-House Waste", icon: <Trash className="w-5 h-5" />, path: "/inhouse" },
    { label: "Remarks", icon: <Notebook className="w-5 h-5" />, path: "/misc" },
  ];

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="h-screen w-64 bg-white border-r shadow-lg fixed flex flex-col">
      <div className="flex items-center px-6 py-4 border-b">
        <img src={BioFlytLogo} alt="BioFlyt Logo" className="h-10 mr-3" />
        <span className="text-xl font-black text-green-500">Admin Dashboard</span>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.label}
            to={item.path}
            onClick={() => setActive(item.label)}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-green-100 transition ${
              active === item.label ? "bg-green-200 font-medium" : ""
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ))}

        {/* BioFlyt Mobile App Dropdown */}
        <div ref={dropdownRef} className="relative">
          <button
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-green-100 transition ${
              active === "BioFlyt Mobile App" ? "bg-green-200 font-medium" : ""
            }`}
          >
            <Smartphone className="w-5 h-5" />
            <span>BioFlyt Mobile App</span>
            <svg
              className="w-3 h-3 ml-auto transform transition-transform"
              style={{ transform: isDropdownOpen ? "rotate(180deg)" : "rotate(0deg)" }}
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

          {isDropdownOpen && (
            <div className="ml-6 mt-1 space-y-1">
              <Link
                to="/MobileApp"
                onClick={() => {
                  setActive("BioFlyt Mobile App");
                  setIsDropdownOpen(false);
                }}
                className="block px-3 py-2 text-sm rounded-lg hover:bg-green-100 transition"
              >
                Mobile App Dashboard
              </Link>
              <Link
                to="/addvideotomobile"
                onClick={() => {
                  setActive("BioFlyt Mobile App");
                  setIsDropdownOpen(false);
                }}
                className="block px-3 py-2 text-sm rounded-lg hover:bg-green-100 transition"
              >
                Add Video to Mobile
              </Link>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Sidenavbar;
