import React, { useState, useEffect } from "react";
import axios from "axios";
import TextField from "@mui/material/TextField";
import axiosInstance from '../api/axiosConfig';
import "./signup.css";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { Button } from "@mui/material";
import ProfilePictureUpload from "./assets/ProfilePictureUpload";

const SignUp = () => {
  const [date_of_birth, setDateOfBirth] = useState(dayjs());
  const [dateJoined, setDateJoined] = useState(dayjs());
  const [MaritalStatus, setMaritalStatus] = useState("");
  const [employeeID, setEmployeeID] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);

  const [formData, setFormData] = useState({
    firstname: "",
    middlename: "",
    surname: "",
    gender: "",
    nationality: "",
    email: "",
    phonenumber: "",
    emergency_contact_name: "",
    emergency_phonenumber: "",
    current_address: "",
    permanent_address: "",
    jobTitle: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const generateID = `EMP-${new Date()
      .toISOString()
      .slice(0, 10)
      .replace(/-/g, "")}-${Math.floor(1000 + Math.random() * 9000)}`;
    setEmployeeID(generateID);
  }, []);

  const handleChange = (event) => {
    setMaritalStatus(event.target.value);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    const payload = {
      ...formData,
      date_of_birth: date_of_birth.format("YYYY-MM-DD"),
      DateJoined: dateJoined.format("YYYY-MM-DD"),
      MaritalStatus,
      employeeID,
    };
  
    const formDataToSend = new FormData();
  
    // Append form data
    Object.keys(payload).forEach(key => {
      formDataToSend.append(key, payload[key]);
    });
  
    // If a profile picture is selected, append it as well
    if (profilePicture) {
      formDataToSend.append('profile', profilePicture);
    }
  
    console.log("Form Payload:", payload); // Debugging
  
    try {
      const response = await axiosInstance.post('/api/auth/signup', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      console.log("Success:", response.data);
      alert("Registration successful!");
    } catch (error) {
      console.error("Error:", error);
  
      if (error.response && error.response.data && error.response.data.message) {
        alert(error.response.data.message);
      } else {
        alert("Error submitting form.");
      }
    }
  };
  
  

  return (
    <div className="parent">
      <div className="left">
        <h2 className="numberingsTitle">1. Personal Information</h2>
        <div className="information_three">
          <TextField
            name="firstname"
            label="Firstname"
            fullWidth
            margin="normal"
            onChange={handleInputChange}
          />
          <TextField
            name="middlename"
            label="Middle Name"
            fullWidth
            margin="normal"
            onChange={handleInputChange}
          />
          <TextField
            name="surname"
            label="Surname"
            fullWidth
            margin="normal"
            onChange={handleInputChange}
          />
        </div>

        <div className="information_three">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Date of Birth"
              value={date_of_birth}
              onChange={(newValue) => setDateOfBirth(newValue)}
              slotProps={{ textField: { fullWidth: true, margin: "normal" } }}
            />
          </LocalizationProvider>
          <TextField
            name="gender"
            label="Gender"
            fullWidth
            margin="normal"
            onChange={handleInputChange}
          />
        </div>

        <div className="flex-row-group">
          <TextField
            name="nationality"
            label="Nationality"
            className="flex-1-field"
            margin="normal"
            onChange={handleInputChange}
          />
          <FormControl className="flex-1-field" margin="normal">
            <InputLabel id="marital-status-label">Marital Status</InputLabel>
            <Select
              labelId="marital-status-label"
              value={MaritalStatus}
              onChange={handleChange}
            >
              <MenuItem value="Single">Single</MenuItem>
              <MenuItem value="Married">Married</MenuItem>
              <MenuItem value="Divorced">Divorced</MenuItem>
              <MenuItem value="Widowed">Widowed</MenuItem>
            </Select>
          </FormControl>
        </div>

        <h2 className="numberingsTitle">2. Contact Information</h2>
        <div className="flex-row-group">
          <TextField
            name="email"
            label="Email Address (optional)"
            fullWidth
            margin="normal"
            onChange={handleInputChange}
          />
          <TextField
            name="phonenumber"
            label="Phone Number"
            fullWidth
            margin="normal"
            onChange={handleInputChange}
          />
        </div>
        <div className="flex-row-group">
          <TextField
            name="emergency_contact_name"
            label="Emergency Contact Person"
            fullWidth
            margin="normal"
            onChange={handleInputChange}
          />
          <TextField
            name="emergency_phonenumber"
            label="Emergency Contact Number"
            fullWidth
            margin="normal"
            onChange={handleInputChange}
          />
        </div>
        <h2 className="numberingsTitle">Profile Picture</h2>
        <ProfilePictureUpload onFileSelect={(file) => setProfilePicture(file)} />
        <h2 className="numberingsTitle">3. Address Details</h2>
        <div className="flex-row-group">
          <TextField
            name="current_address"
            label="Current Address"
            fullWidth
            margin="normal"
            onChange={handleInputChange}
          />
          <TextField
            name="permanent_address"
            label="Permanent Address"
            fullWidth
            margin="normal"
            onChange={handleInputChange}
          />
        </div>

        <h2 className="numberingsTitle">4. Employment Details</h2>
        <div className="flex-row-group">
          <TextField
            name="employeeID"
            label="Employee ID"
            fullWidth
            margin="normal"
            value={employeeID}
            InputProps={{ readOnly: true }}
          />
          <TextField
            name="jobTitle"
            label="Position/ Job Title"
            fullWidth
            margin="normal"
            onChange={handleInputChange}
          />
        </div>

        <h2 className="numberingsTitle">5. Account and Security</h2>
        <TextField
          name="username"
          label="Username or Email Address"
          margin="normal"
          fullWidth
          onChange={handleInputChange}
        />
        <TextField
          name="password"
          label="Password"
          type="password"
          margin="normal"
          fullWidth
          onChange={handleInputChange}
        />
        <TextField
          name="confirmPassword"
          label="Confirm Password"
          type="password"
          margin="normal"
          fullWidth
          onChange={handleInputChange}
        />

        <Button className="submit-button" onClick={handleSubmit}>
          Submit
        </Button>
      </div>
      <div className="right">
        <p>hi</p>
      </div>
    </div>
  );
};

export default SignUp;
