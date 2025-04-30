import React, { useState, useEffect } from "react";
import Sidenavbar from "../../Admin Utilities/sidenavbar";
import axiosInstance from "../../api/axiosConfig";

export const EmployeeManagement = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [users, setUsers] = useState([]); // State to store the fetched users data

  // Fetch users data when the component mounts
  useEffect(() => {
    axiosInstance
      .get("api/users/")
      .then((response) => {
        // Store the fetched users in the state
        setUsers(response.data.users);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }, []); // Empty dependency array means this runs once when the component mounts

  return (
    <div className="flex h-screen w-full">
      {/* Sidebar */}
      <div className="w-64 min-w-[16rem] border-r border-gray-200 bg-white">
        <Sidenavbar />
      </div>

      {/* Content */}
      <div className="flex-1  p-6 overflow-auto">
        <h1 className="text-2xl font-bold mb-4">Employee Management</h1>
        
        {/* User Table */}
        <table className="min-w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="border-b p-4 text-left text-sm font-semibold text-gray-700">Employee ID</th>
            <th className="border-b p-4 text-left text-sm font-semibold text-gray-700">First Name</th>
            <th className="border-b p-4 text-left text-sm font-semibold text-gray-700">Middle Name</th>
            <th className="border-b p-4 text-left text-sm font-semibold text-gray-700">Surname</th>
            <th className="border-b p-4 text-left text-sm font-semibold text-gray-700">Phone Number</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="border-b p-4 text-sm text-gray-700">{user.employee_id}</td>
                <td className="border-b p-4 text-sm text-gray-700">{user.firstname}</td>
                <td className="border-b p-4 text-sm text-gray-700">{user.middlename}</td>
                <td className="border-b p-4 text-sm text-gray-700">{user.surname}</td>
                <td className="border-b p-4 text-sm text-gray-700">{user.phonenumber}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="p-4 text-center text-gray-500">
                No users available
              </td>
            </tr>
          )}
        </tbody>
      </table>
      </div>
    </div>
  );
};