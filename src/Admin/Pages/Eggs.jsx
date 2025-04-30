import React, { useState, useEffect } from "react";
import Sidenavbar from "../../Admin Utilities/sidenavbar";
import AxiosInstance from "../../api/axiosConfig";
import { useNavigate } from "react-router-dom";
import { EggsModal } from "../Modals/eggsModal";

export const Eggs = () => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [eggData, setEggData] = useState([]);
  const navigate = useNavigate();
  const [showEggsModal, setShowEggsModal] = useState(false);

const openEggsModal = () => setShowEggsModal(true);
const closeEggsModal = () => setShowEggsModal(false);

  useEffect(() => {
    // Fetching data from the backend
    AxiosInstance.get('/api/eggs/')
      .then(response => {
        const fetchedData = response.data.map(item => ({
          employeeId: item.employee_id,
          firstname: item.firstname,
          grams: item.weight,
          date: new Date(item.date).toLocaleDateString(),
          status: item.status === 0 ? 'Pending' : item.status === 3 ? 'Accepted' : 'Declined',
          id: item.id,
        }));
        setEggData(fetchedData); // Set the fetched data into the state
      })
      .catch(error => {
        console.error('Error fetching data: ', error);
      });
  }, []);

  const sortedData = [...eggData].sort((a, b) => {
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

  const handleAccept = (id) => {
    AxiosInstance.post(`/api/eggs/approve`, { id })
      .then(response => {
        // Update the egg data after the status change
        setEggData(prevData => prevData.map(entry =>
          entry.id === id ? { ...entry, status: 'Accepted' } : entry
        ));
        navigate(0);  // Reload page after update
      })
      .catch(error => {
        console.error('Error approving egg collection:', error);
      });
  };

  const handleDecline = (id) => {
    AxiosInstance.post(`/api/eggs/decline`, { id })
      .then(response => {
        // Update the egg data after the status change
        setEggData(prevData => prevData.map(entry =>
          entry.id === id ? { ...entry, status: 'Declined' } : entry
        ));
      })
      .catch(error => {
        console.error('Error declining egg collection:', error);
      });
  };

  const refreshEggData = () => {
    AxiosInstance.get('/api/eggs/')
      .then(response => {
        const fetchedData = response.data.map(item => ({
          employeeId: item.employee_id,
          firstname: item.firstname,
          grams: item.weight,
          date: new Date(item.date).toLocaleDateString(),
          status: item.status === 0 ? 'Pending' : item.status === 3 ? 'Accepted' : 'Declined',
          id: item.id,
        }));
        setEggData(fetchedData);
      })
      .catch(error => {
        console.error('Error refreshing egg data: ', error);
      });
  };

  return (
    <div className="flex h-screen w-full">
      {/* Sidebar */}
      <div className="w-64 min-w-[16rem] border-r border-gray-200 bg-white">
        <Sidenavbar />
      </div>

      {/* Content */}
      <div className="flex-1 p-6 overflow-auto bg-gray-100">
        <h1 className="text-2xl font-bold mb-4">BSF Eggs Collection</h1>
        <button
  onClick={openEggsModal}
  className="mb-4 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded shadow"
>
  + Add Egg Entry
</button>

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full table-auto text-sm text-left text-gray-700">
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
              <tr>
                <th onClick={() => handleSort("firstname")} className="px-6 py-3 cursor-pointer hover:underline">
                  Employee Name {sortConfig.key === "firstname" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
                </th>
                <th onClick={() => handleSort("grams")} className="px-6 py-3 cursor-pointer hover:underline">
                  Eggs In Grams {sortConfig.key === "grams" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
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
                  className={`border-b ${entry.status === "Accepted" ? "bg-green-50" : entry.status === "Declined" ? "bg-red-50" : "bg-yellow-50"}`}
                >
                  <td className="px-6 py-4">{entry.firstname}</td>
                  <td className="px-6 py-4">{entry.grams}g</td>
                  <td className="px-6 py-4">{entry.date}</td>
                  <td className="px-6 py-4 font-medium">{entry.status}</td>
                  <td className="px-6 py-4 space-x-2">
                    {entry.status === "Pending" ? (
                      <>
                        <button onClick={() => handleAccept(entry.id)}
                          className="bg-green-500 hover:bg-green-600 text-white text-xs font-semibold px-4 py-2 rounded-full shadow transition duration-200">
                          Accept
                        </button>
                        <button onClick={() => handleDecline(entry.id)}
                          className="bg-red-500 hover:bg-red-600 text-white text-xs font-semibold px-4 py-2 rounded-full shadow transition duration-200">
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
      
<EggsModal
  isOpen={showEggsModal}
  onClose={closeEggsModal}
  onSubmitSuccess={refreshEggData}
/>
    </div>
  );
};
