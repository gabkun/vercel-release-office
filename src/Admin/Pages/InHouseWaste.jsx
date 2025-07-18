import React, {useEffect, useState } from 'react'
import Sidenavbar from '../../Admin Utilities/sidenavbar'
import AxiosInstance from "../../api/axiosConfig";
import { useNavigate } from "react-router-dom";
import { InHouseModal } from '../Modals/inhouseModal';
import { DateRangeModal } from "../Modals/DateFilter";

export const WasteHouse = () => {
      const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
      const [foodData, setFoodData] = useState([]);
      const navigate = useNavigate();
      const [showFoodModal, setShowFoodModal] = useState(false);
      const [employees, setEmployees] = useState([]);
      const [showDateModal, setShowDateModal] = useState(false);
    const openFoodModal = () => setShowFoodModal(true);
    const closeFoodModal = () => setShowFoodModal(false);
        const [filteredData, setFilteredData] = useState([]);
        const [dateRange, setDateRange] = useState([
        {
          startDate: new Date(),
          endDate: new Date(),
          key: "selection",
        },
      ]);
    
      useEffect(() => {
        // Fetching data from the backend
        AxiosInstance.get('/api/inhouse/')
          .then(response => {
            const fetchedData = response.data.map(item => ({
              employeeId: item.employee_id,
              firstname: item.firstname,
              grams: item.weight,
              date: new Date(item.date).toLocaleDateString(),
              status: item.status === 0 ? 'Pending' : item.status === 3 ? 'Accepted' : 'Declined',
              id: item.id,
            }));
            setFoodData(fetchedData); // Set the fetched data into the state
  
            
                // Filter to today's entries by default
          const today = new Date();
          const startOfToday = new Date(today.setHours(0, 0, 0, 0));
          const endOfToday = new Date(today.setHours(23, 59, 59, 999));
  
          const todayEntries = fetchedData.filter((entry) => {
            const entryDate = new Date(entry.date);
            return entryDate >= startOfToday && entryDate <= endOfToday;
          });
  
          setFilteredData(todayEntries);
  
          })
          .catch(error => {
            console.error('Error fetching data: ', error);
          });
      }, []);
    
      useEffect(() => {
      AxiosInstance.get('/api/users/employees') // Adjust endpoint to your API route
        .then(response => setEmployees(response.data))
        .catch(error => console.error('Error fetching employees:', error));
    }, []);
    
      const sortedData = [...foodData].sort((a, b) => {
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
        AxiosInstance.post(`/api/inhouse/approve`, { id })
          .then(response => {
            // Update the egg data after the status change
            setFoodData(prevData => prevData.map(entry =>
              entry.id === id ? { ...entry, status: 'Accepted' } : entry
            ));
            navigate(0);  // Reload page after update
          })
          .catch(error => {
            console.error('Error approving inhouse waste collection:', error);
          });
      };
    
      const handleDecline = (id) => {
        AxiosInstance.post(`/api/inhouse/decline`, { id })
          .then(response => {
            // Update the egg data after the status change
            setFoodData(prevData => prevData.map(entry =>
              entry.id === id ? { ...entry, status: 'Declined' } : entry
            ));
          })
          .catch(error => {
            console.error('Error declining inhouse waste collection:', error);
          });
      };
    
      const refreshData = () => {
        AxiosInstance.get('/api/inhouse/')
          .then(response => {
            const fetchedData = response.data.map(item => ({
              employeeId: item.employee_id,
              firstname: item.firstname,
              grams: item.weight,
              date: new Date(item.date).toLocaleDateString(),
              status: item.status === 0 ? 'Pending' : item.status === 3 ? 'Accepted' : 'Declined',
              id: item.id,
            }));
            setFoodData(fetchedData);
          })
          .catch(error => {
            console.error('Error refreshing inhouse waste data: ', error);
          });
      };
    
        // Filter data by selected date range
        useEffect(() => {
          const { startDate, endDate } = dateRange[0];
      
          const filtered = foodData.filter((entry) => {
            const entryDate = new Date(entry.date);
            return entryDate >= startDate && entryDate <= endDate;
          });
      
          setFilteredData(filtered);
        }, [dateRange]);
      
          const sortedFilteredData = [...filteredData].sort((a, b) => {
          if (!sortConfig.key) return 0;
      
          let aValue = a[sortConfig.key];
          let bValue = b[sortConfig.key];
      
          if (sortConfig.key === "grams") {
            aValue = Number(aValue);
            bValue = Number(bValue);
          }
      
          return sortConfig.direction === "asc"
            ? aValue < bValue
              ? -1
              : 1
            : aValue > bValue
            ? -1
            : 1;
        });
      
  return (
    <div className="flex h-screen w-full">
      {/* Sidebar */}
      <div className="w-64 min-w-[16rem] border-r border-gray-200 bg-white">
        <Sidenavbar />
      </div>

      {/* Content */}
      <div className="flex-1 bg-gray-100 p-6 overflow-auto">
        <h1 className="text-2xl font-bold mb-4">In-House Waste Monitoring</h1>
                                <button
          onClick={() => setShowDateModal(true)}
          className="mb-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded shadow"
        >
          Filter by Date
        </button>
                <button
          onClick={openFoodModal}
          className="mb-4 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded shadow"
        >
          + Add Waste Entry
        </button>
                      <div className="mb-4">
              <DateRangeModal
                isOpen={showDateModal}
                onClose={() => setShowDateModal(false)}
                dateRange={dateRange}
                setDateRange={setDateRange}
              />
                      </div>
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                  <table className="min-w-full table-auto text-sm text-left text-gray-700">
                    <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                      <tr>
                        <th onClick={() => handleSort("firstname")} className="px-6 py-3 cursor-pointer hover:underline">
                          Employee Name {sortConfig.key === "firstname" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
                        </th>
                        <th onClick={() => handleSort("grams")} className="px-6 py-3 cursor-pointer hover:underline">
                          Waste In Kilos {sortConfig.key === "grams" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
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
                     {sortedFilteredData.map((entry, index) => (
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
                          <td className="px-6 py-4">{entry.firstname}</td>
                          <td className="px-6 py-4">{entry.grams}kg</td>
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
              
        <InHouseModal
          isOpen={showFoodModal}
          onClose={closeFoodModal}
          onSubmitSuccess={refreshData}
          employees={employees}
        />
         </div>
  )
}
