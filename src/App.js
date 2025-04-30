
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/" element={<Login />} />
        <Route path="/overall" element={<PrivateRoute><OverallPage /></PrivateRoute>} />
        <Route path="/prod" element={<PrivateRoute><ProductInput /></PrivateRoute>} />
        <Route path="/Analytics" element={<PrivateRoute><Analytics /></PrivateRoute>} />
        <Route path="/Eggs" element={<PrivateRoute><Eggs /></PrivateRoute>} />
        <Route path="/EmployeeManagement" element={<PrivateRoute><EmployeeManagement /></PrivateRoute>} />
        <Route path="/EmployeeMonitoring" element={<PrivateRoute><EmployeeMonitoring /></PrivateRoute>} />
        <Route path="/Larvae" element={<PrivateRoute><Larvae /></PrivateRoute>} />
        <Route path="/MobileApp" element={<PrivateRoute><MobileApp /></PrivateRoute>} />
        <Route path="/employeehours" element={<PrivateRoute><EmployeeHours /></PrivateRoute>} />

      </Routes>
    </Router>
  );
}

export default App;


{/* <Route path="/overall" element={<OverallPage />} />
<Route path="/prod" element={<ProductInput />} />
<Route path="/Analytics" element={<Analytics />} />
<Route path="/Eggs" element={<Eggs />} />
<Route path="/EmployeeManagement" element={<EmployeeManagement />} />
<Route path="/EmployeeMonitoring" element={<EmployeeMonitoring />} />
<Route path="/Larvae" element={<Larvae />} />
<Route path="/MobileApp" element={<MobileApp />} />
<Route path="/employeehours" element={<EmployeeHours />} /> */}