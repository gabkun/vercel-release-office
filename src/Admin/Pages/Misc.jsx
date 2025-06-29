import React, { useState, useEffect } from "react";
import Sidenavbar from "../../Admin Utilities/sidenavbar";
import AxiosInstance from "../../api/axiosConfig";
import { MiscModal } from "../Modals/miscModal";
import { FaUserCircle, FaStickyNote, FaClock } from 'react-icons/fa';

export const Misc = () => {
  const [entries, setEntries] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchEntries = async () => {
    try {
      const res = await AxiosInstance.get("/api/misc/");
      setEntries(res.data);
    } catch (err) {
      console.error("Failed to fetch entries:", err);
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await AxiosInstance.get("/api/users/employees"); // adjust to your real endpoint
      setEmployees(res.data);
    } catch (err) {
      console.error("Failed to fetch employees:", err);
    }
  };

  const handleApprove = async (id) => {
    await AxiosInstance.post("/api/misc/approve", { id });
    fetchEntries();
  };

  const handleDecline = async (id) => {
    await AxiosInstance.post("/api/misc/decline", { id });
    fetchEntries();
  };

  useEffect(() => {
    fetchEntries();
    fetchEmployees();
  }, []);

  return (
    <>
      <div className="flex h-screen w-full">
        <div className="div">
          <div className="">
            <Sidenavbar />
          </div>
        </div>
        <div className="flex-1 bg-gray-100 p-6 overflow-auto">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Employee Notes Monitoring</h1>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
            >
              + Add Remarks
            </button>
          </div>

          <MiscModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSubmitSuccess={fetchEntries}
            employees={employees}
          />

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {entries.length > 0 ? (
              entries.map((entry) => (
                <div
                  key={entry.id}
                  className="bg-white rounded-xl shadow-md p-4 flex flex-col gap-3"
                >
                  {/* Header */}
                  <div className="flex items-center gap-3">
                    <FaUserCircle className="text-blue-500 text-3xl" />
                    <div>
                      <h2 className="font-semibold text-gray-800 text-lg">
                        {entry.firstname} {entry.surname}
                      </h2>
                      <p className="text-gray-500 text-sm">
                        Employee ID: {entry.employee_id}
                      </p>
                    </div>
                  </div>

                  {/* Note */}
                  <div className="flex items-start gap-2 text-gray-700">
                    <FaStickyNote className="mt-1 text-gray-400" />
                    <p>{entry.note || "No note provided."}</p>
                  </div>

                  {/* Date & Status */}
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <FaClock />
                      <span>{new Date(entry.date).toLocaleDateString()}</span>
                    </div>
                    <span
                      className={`font-semibold px-2 py-1 rounded-full text-xs ${
                        entry.status === 0
                          ? "bg-yellow-100 text-yellow-700"
                          : entry.status === 2
                          ? "bg-red-100 text-red-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {entry.status === 0 && "Pending"}
                      {entry.status === 2 && "Declined"}
                      {entry.status === 3 && "Approved"}
                    </span>
                  </div>

                  {/* Actions */}
                  {entry.status === 0 && (
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => handleApprove(entry.id)}
                        className="flex-1 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleDecline(entry.id)}
                        className="flex-1 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                      >
                        Decline
                      </button>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 col-span-full py-4">
                No entries found.
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
