import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import SignUp from "./Authentication/authentication-signup";
import Login from "./Authentication/authentication-login";
import { OverallPage } from "./Admin/Overall";
import Sidenavbar from "./Admin Utilities/sidenavbar";
import { EmployeeHours } from "./ByGabComponent/EmployeeHours";
import Analytics from './Admin/Pages/Analytics';
import { Eggs } from "./Admin/Pages/Eggs";
import { EmployeeManagement } from "./Admin/Pages/Employeemanagement";
import { EmployeeMonitoring } from "./Admin/Pages/Employeemonitoring";
import { Larvae } from "./Admin/Pages/Larve";
import { MobileApp } from "./Admin/Pages/MobileApp";
import { ProductInput } from "./Admin/Pages/ProductInput";
import PrivateRoute from './Protected/Routes';
import { FoodWaste } from "./Admin/Pages/FoodWaste";
import { ExportProducts } from "./Admin/Pages/ExportProducts";
import { Misc } from "./Admin/Pages/Misc";
import { Pellets } from "./Admin/Pages/Pellets";
import { Fertilizer } from "./Admin/Pages/Fertilizer";
import { WasteHouse } from "./Admin/Pages/InHouseWaste";

function App() {
  useEffect(() => {
    // Clear localStorage
    localStorage.clear();

    // Clear sessionStorage if needed
    sessionStorage.clear();

    // Clear cookies
    document.cookie.split(";").forEach((cookie) => {
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
    });
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/" element={<Login />} />
        <Route path="/overall" element={<PrivateRoute><OverallPage /></PrivateRoute>} />
        <Route path="/inhouse" element={<PrivateRoute><WasteHouse /></PrivateRoute>} />
        <Route path="/prod" element={<PrivateRoute><ProductInput /></PrivateRoute>} />
        <Route path="/Analytics" element={<PrivateRoute><Analytics /></PrivateRoute>} />
        <Route path="/Eggs" element={<PrivateRoute><Eggs /></PrivateRoute>} />
        <Route path="/EmployeeManagement" element={<PrivateRoute><EmployeeManagement /></PrivateRoute>} />
        <Route path="/EmployeeMonitoring" element={<PrivateRoute><EmployeeMonitoring /></PrivateRoute>} />
        <Route path="/Larvae" element={<PrivateRoute><Larvae /></PrivateRoute>} />
        <Route path="/MobileApp" element={<PrivateRoute><MobileApp /></PrivateRoute>} />
        <Route path="/foodwaste" element={<PrivateRoute><FoodWaste /></PrivateRoute>} />
        <Route path="/exportprods" element={<PrivateRoute><ExportProducts /></PrivateRoute>} />
        <Route path="/misc" element={<PrivateRoute><Misc /></PrivateRoute>} />
        <Route path="/pellets" element={<PrivateRoute><Pellets /></PrivateRoute>} />
        <Route path="/fertilizer" element={<PrivateRoute><Fertilizer /></PrivateRoute>} />
         <Route path="/employeehours" element={<EmployeeHours />} />
       
      </Routes>
    </Router>
  );
}

export default App;
