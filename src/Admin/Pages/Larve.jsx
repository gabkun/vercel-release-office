import React, { useState, useEffect } from "react";
import Sidenavbar from "../../Admin Utilities/sidenavbar";
import axiosInstance from "../../api/axiosConfig";
import { useNavigate } from "react-router-dom";
import { LarvaeModal } from "../Modals/larvaeModal";

export const Larvae = () => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [Larvae, setLarvae] = useState([]);
  const [showModal, setShowModal] = useState(false);
    const [employees, setEmployees] = useState([]);
    

    const navigate = useNavigate();
useEffect(() => {
  const formatLocalDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  axiosInstance.get('/api/larpup/all')
    .then(res => {
      const formattedData = res.data.map(item => ({
        id: item.id,
        employeeId: `${item.firstname}`,
        type: item.input_type === 1 ? 'Larvae' : 'Pupae',
        grams: item.weight,
        date: formatLocalDate(item.date),
        status:
          item.status === 1 ? 'Pending' :
          item.status === 3 ? 'Accepted' :
          item.status === 2 ? 'Declined' : 'Unknown',
      }));
      setLarvae(formattedData);
    })
    .catch(err => {
      console.error("Error fetching larvae/pupae data:", err);
    });
}, []);

    useEffect(() => {
  axiosInstance.get('/api/users/employees') // Adjust endpoint to your API route
    .then(response => setEmployees(response.data))
    .catch(error => console.error('Error fetching employees:', error));
}, []);


  const sortedData = [...Larvae].sort((a, b) => {
    if (!sortConfig.key) return 0;

    let aValue = a[sortConfig.key];
    let bValue = b[sortConfig.key];

    if (sortConfig.key === "grams") {
      aValue = Number(aValue);
      bValue = Number(bValue);
    }

    if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const handleSort = (key) => {
    setSortConfig((prevConfig) => {
      if (prevConfig.key === key) {
        return { key, direction: prevConfig.direction === "asc" ? "desc" : "asc" };
      }
      return { key, direction: "asc" };
    });
  };

  const handleApprove = async (id) => {
    console.log("working")
    try {
      await axiosInstance.post('/api/larpup/approve', { id });
      setLarvae(prev =>
        prev.map(item => item.id === id ? { ...item, status: 'Accepted' } : item)
      );
      navigate(0);
    } catch (error) {
      console.error('Error approving:', error);
      alert('Failed to approve.');
    }
  };
  
  const handleDecline = async (id) => {
    try {
      await axiosInstance.post('/api/larpup/decline', { id });
      setLarvae(prev =>
        prev.map(item => item.id === id ? { ...item, status: 'Declined' } : item)
      );
      navigate(0);
    } catch (error) {
      console.error('Error declining:', error);
      alert('Failed to decline.');
    }
  };

  
const handleFormSubmit = async (data) => {
  try {
    await axiosInstance.post('/api/larpup/create', data);
    alert("Submitted successfully!");
    setShowModal(false);
  } catch (error) {
    console.error("Submission failed:", error);
  }
};
  return (
    <div className="flex h-screen w-full">
      {/* Sidebar */}
      <div className="w-64 min-w-[16rem] border-r border-gray-200 bg-white">
        <Sidenavbar />
      </div>

      {/* Content */}
      <div className="flex-1 p-6 overflow-auto bg-gray-100">
        <h1 className="text-2xl font-bold mb-4">BSF Larvae / Pupae Collection</h1>
        <button
        onClick={() => setShowModal(true)}
        className="mb-4 px-4 py-2 bg-indigo-600 text-white rounded-full shadow hover:bg-indigo-700 transition"
      >
        + Add Entry
      </button>
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full table-auto text-sm text-left text-gray-700">
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
              <tr>
                <th onClick={() => handleSort("employeeId")} className="px-6 py-3 cursor-pointer hover:underline">
                  Employee Name {sortConfig.key === "employeeId" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
                </th>
                <th onClick={() => handleSort("type")} className="px-6 py-3 cursor-pointer hover:underline">
                  Type {sortConfig.key === "type" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
                </th>
                <th onClick={() => handleSort("grams")} className="px-6 py-3 cursor-pointer hover:underline">
                  Count In Kilos {sortConfig.key === "grams" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
                </th>
                <th onClick={() => handleSort("date")} className="px-6 py-3 cursor-pointer hover:underline">
                  Date Inputted {sortConfig.key === "date" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
                </th>
                <th onClick={() => handleSort("status")} className="px-6 py-3 cursor-pointer hover:underline">
                  Status {sortConfig.key === "status" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
                </th>
                <th className="px-6 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {sortedData.map((entry, index) => (
                <tr
                  key={index}
                  className={`border-b ${
                    entry.status === "Accepted"
                      ? "bg-green-50"
                      : entry.status === "Declined"
                      ? "bg-red-50"
                      : "bg-yellow-50"
                  }`}
                >
                  <td className="px-6 py-4">{entry.employeeId}</td>
                  <td className="px-6 py-4">{entry.type}</td>
                  <td className="px-6 py-4">{entry.grams}kg</td>
                  <td className="px-6 py-4">{entry.date}</td>
                  <td className="px-6 py-4 font-medium">{entry.status}</td>
                  <td className="px-6 py-4 space-x-2">
                  {entry.status === "Pending" ? (
                        <>
                          <button
                            onClick={() => handleApprove(entry.id)}
                            className="bg-green-500 hover:bg-green-600 text-white text-xs font-semibold px-4 py-2 rounded-full shadow transition duration-200"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleDecline(entry.id)}
                            className="bg-red-500 hover:bg-red-600 text-white text-xs font-semibold px-4 py-2 rounded-full shadow transition duration-200"
                          >
                            Decline
                          </button>
                        </>
                      ) : (
                        <button className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold px-4 py-2 rounded-full shadow transition duration-200">
                          View
                        </button>
                      )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <LarvaeModal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  onSubmit={handleFormSubmit}
    employees={employees}
/>

    </div>
  );
};
