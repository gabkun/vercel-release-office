import React, { useState, useEffect } from "react";
import Sidenavbar from "../../Admin Utilities/sidenavbar";
import axiosInstance from "../../api/axiosConfig";
import { io } from "socket.io-client";

// 👉 Replace this with your deployed backend or local backend
const socket = io("https://backend-bioflytoffice-402579879370.asia-east1.run.app/"); // 👈 or your deployed URL

export const EmployeeMonitoring = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const fetchAttendance = async () => {
    try {
      const response = await axiosInstance.get("/api/attendance/status");
      setAttendanceData(response.data);
    } catch (error) {
      console.error("Error fetching attendance data:", error);
    }
  };

useEffect(() => {
  fetchAttendance();

  // Listen to socket event
  socket.on("attendanceUpdated", () => {
    console.log("Real-time update received");
    fetchAttendance();  // Fetch the updated attendance data
  });

  // Cleanup
  return () => {
    socket.off("attendanceUpdated");
  };
}, []);
  
const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString("en-US", {
    timeZone: "UTC",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleDateString("en-US", {
    timeZone: "UTC",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

  const getStatusLabel = (status) => {
    switch (status) {
      case 1:
        return "Timed In";
      case 0:
        return "Timed Out";
      case 3:
        return "Break Time";
      default:
        return "Unknown";
    }
  };

  return (
    <div className="flex h-screen w-full">
      {/* Sidebar */}
      <div className="w-64 min-w-[16rem] border-r border-gray-200 bg-white">
        <Sidenavbar />
      </div>

      {/* Content */}
      <div className="flex-1 bg-gray-100 p-6 overflow-auto">
        <h1 className="text-2xl font-bold mb-4">Employee Monitoring</h1>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full text-sm text-left text-gray-700">
            <thead className="bg-gray-200 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Time</th>
                <th className="px-6 py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {attendanceData.map((entry) => (
                <tr key={entry.id} className="border-b">
                  <td className="px-6 py-4">{entry.firstname} {entry.surname}</td>
                  <td className="px-6 py-4">{getStatusLabel(entry.attendance_status)}</td>
                  <td className="px-6 py-4">{formatTime(entry.timestamp)}</td>
                  <td className="px-6 py-4">{formatDate(entry.timestamp)}</td>
                </tr>
              ))}
              {attendanceData.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center py-4 text-gray-500">
                    No attendance records found for today.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
