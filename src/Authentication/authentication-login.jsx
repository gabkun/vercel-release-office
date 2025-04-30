import React, { useState} from "react";
import "./login.css";
import TextField from "@mui/material/TextField";
import bioflyt from "../assets/bioflyt logo full 1.svg";
import axiosInstance from '../api/axiosConfig'
import { useNavigate } from "react-router-dom";


import DangerousIcon from "@mui/icons-material/Dangerous";

const Login = () => {
  const navigate = useNavigate();
  const [catchError, setcatchError] = useState(null);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (event) => {
    const { id, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };



  const Catch_error = () => {
    return (
      <div className="catcherror">
        <div className="w-[10%]">
          <DangerousIcon sx={{ color: "#eb2525" }} />
        </div>
        <div>
          <p className="text-sm text-red-700">
            Something went wrong or please check your account information
          </p>
        </div>
      </div>
    );
  };

  const handleLogin = () => {
    const { email, password } = formData;
  
    if (email === "admin@bioflyt.com" && password === "12345") {
      // Simulate successful login by setting a flag in localStorage
      localStorage.setItem("isAuthenticated", "true");
  
      // Redirect to analytics
      navigate("/Analytics");
    } else {
      // Show error
      setcatchError(() => <Catch_error />);
    }
  };
  
  return (
    <>
      <div className="parent">
        <div className="login_wrapper">
          <div className="flex-col">
            <div className="title_wrapper">
              <div className="image">
                <img src={bioflyt} alt="logo_bioflyt" />
              </div>
              <h1 className="title">Login your Account</h1>
              <p className="text-[#989898]">
                Hello, welcome back to your account
              </p>
            </div>

            <div className="textfield_wrapper">
              <div className="div">
                <TextField
                  id="email"
                  label="Email Address"
                  margin="normal"
                  fullWidth
                  onChange={handleInputChange}
                />
              </div>

              <div className="div">
                <TextField
                  id="password"
                  label="Password"
                  type="password"
                  margin="normal"
                  fullWidth
                  onChange={handleInputChange}
                />
              </div>

              <button
                variant="contained"
                onClick={handleLogin}
                className="login_btn"
              >
                <p className="text-[#fff]">LOGIN</p>
              </button>
              {catchError}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
