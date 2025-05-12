import React, { useState } from "react";
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
  Wheat,        // for Pellets
  Flower2       // for Fertilizer
} from "lucide-react";

import BioFlytLogo from "../assets/bioflyt logo full 1.svg";

const Sidenavbar = () => {
  const [active, setActive] = useState("Analytics");

  const navItems = [
    { label: "Analytics", icon: <PieChart className="w-5 h-5" />, path: "/Analytics" },
    { label: "BSF Eggs Input", icon: <Egg className="w-5 h-5" />, path: "/Eggs" },
    { label: "BSF Larvae / Pupae Input", icon: <Bug className="w-5 h-5" />, path: "/Larvae" },
    { label: "Employee Management", icon: <Users className="w-5 h-5" />, path: "/EmployeeManagement" },
    { label: "Employee Monitoring", icon: <Monitor className="w-5 h-5" />, path: "/EmployeeMonitoring" },
    { label: "BioFlyt Mobile App", icon: <Smartphone className="w-5 h-5" />, path: "/MobileApp" },
    { label: "BioFlyt Products", icon: <Box className="w-5 h-5" />, path: "/prod" },
    { label: "Food Waste", icon: <Beef className="w-5 h-5" />, path: "/foodwaste" },
    { label: "Pellets Input", icon: <Wheat className="w-5 h-5" />, path: "/pellets" },
    { label: "Fertilizer Input", icon: <Flower2 className="w-5 h-5" />, path: "/fertilizer" },
    { label: "Exports", icon: <Package className="w-5 h-5" />, path: "/exportprods" },
    { label: "Remarks", icon: <Notebook className="w-5 h-5" />, path: "/misc" },
  ];


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
      </nav>
    </div>
  );
};

export default Sidenavbar;
