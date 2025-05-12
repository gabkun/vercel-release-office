import React, { useState, useEffect } from "react";
import Sidenavbar from "../../Admin Utilities/sidenavbar";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid
} from "recharts";
import axiosInstance from "../../api/axiosConfig";

const Analytics = () => {
  const [eggData, setEggData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [pupaeStandingData, setPupaeStandingData] = useState([]);



  const [pelletsStandingData, setPelletsStandingData] = useState([]);
  const [foodwasteStandingData, setFoodwasteStandingData] = useState([]);
  const [fertilizerStandingData, setFertilizerStandingData] = useState([]);
  const [larvaeStandingData, setLarvaeStandingData] = useState([]);

  const eggInputTotal = 1500;
  const totalPupae = 3200;
  const totalLarvae = 4500;
  const outstandingEmployee = "John Doe";

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const transformData = (data) => {
    const dayMap = {};
    const employeeTotals = {};

    data.forEach(item => {
      const { day, total_weight, firstname, surname } = item;
      const employeeName = `${firstname} ${surname}`;
      const weight = parseFloat(total_weight);

      if (!dayMap[day]) {
        dayMap[day] = {};
      }

      if (!dayMap[day][employeeName]) {
        dayMap[day][employeeName] = 0;
      }

      dayMap[day][employeeName] += weight;

      if (!employeeTotals[employeeName]) {
        employeeTotals[employeeName] = 0;
      }

      employeeTotals[employeeName] += weight;
    });

    const sortedEmployees = Object.keys(employeeTotals).sort(
      (a, b) => employeeTotals[b] - employeeTotals[a]
    ).slice(0, 3); // Limit to top 3 employees

    const formatted = daysOfWeek.map(day => {
      const entry = { name: day };
      sortedEmployees.forEach(emp => {
        entry[emp] = dayMap[day]?.[emp] || 0;
      });
      return entry;
    });

    return formatted;
  };

  useEffect(() => {
    const fetchEggData = async () => {
      try {
        const response = await axiosInstance.get('/api/eggs/eggsperday');
        const formatted = transformData(response.data);
        setEggData(response.data);
        setChartData(formatted);
      } catch (error) {
        console.error("Error fetching egg data:", error);
      }
    };

    const fetchPupaeData = async () => {
      try {
        const response = await axiosInstance.get('/api/larpup/pupae/perday');
        const formatted = transformData(response.data);
        setPupaeStandingData(formatted);
      } catch (error) {
        console.error("Error fetching pupae data:", error);
      }
    };

    const fetchLarvaeData = async () => {
      try {
        const response = await axiosInstance.get('/api/larpup/larvae/perday');
        const formatted = transformData(response.data);
        setLarvaeStandingData(formatted);
      } catch (error) {
        console.error("Error fetching larvae data:", error);
      }
    };

      const fetchPelletsData = async () => {
      try {
        const response = await axiosInstance.get('/api/pellets/getPerDay');
        const formatted = transformData(response.data);
        setPelletsStandingData(formatted);
      } catch (error) {
        console.error("Error fetching pellets data:", error);
      }
    };

      const fetchFoodwasteData = async () => {
      try {
        const response = await axiosInstance.get('/api/foodwaste/getPerDay');
        const formatted = transformData(response.data);
        setFoodwasteStandingData(formatted);
      } catch (error) {
        console.error("Error fetching pellets data:", error);
      }
    };
      const fetchFertilizerData = async () => {
      try {
        const response = await axiosInstance.get('/api/fertilizer/getPerDay');
        const formatted = transformData(response.data);
        setFertilizerStandingData(formatted);
      } catch (error) {
        console.error("Error fetching pellets data:", error);
      }
    };

    fetchEggData();
    fetchFertilizerData();
    fetchFoodwasteData();
    fetchPupaeData();
    fetchLarvaeData();
    fetchPelletsData();
  }, []);

  const getEmployeeKeys = (data) => {
    if (!data.length) return [];
    const sample = data[0];
    return Object.keys(sample).filter(key => key !== 'name');
  };

  return (
    <div className="flex h-screen w-full">
      {/* Sidebar */}
      <div className="w-64 min-w-[16rem] border-r border-gray-200 bg-white">
        <Sidenavbar />
      </div>

      {/* Content */}
      <div className="flex-1 p-6 overflow-auto">
        <h1 className="text-2xl font-bold mb-6">Analytics Dashboard</h1>
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-xl shadow-md">
            <p className="text-gray-600">Outstanding Employee</p>
            <h2 className="text-xl font-semibold">{outstandingEmployee}</h2>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-md">
            <p className="text-gray-600">Total BSF Eggs(Today)</p>
            <h2 className="text-xl font-semibold">{eggInputTotal}</h2>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-md">
            <p className="text-gray-600">Total BSF Pupae Input (Today)</p>
            <h2 className="text-xl font-semibold">{totalPupae}</h2>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-md">
            <p className="text-gray-600">Total BSF Larvae Input(Today)</p>
            <h2 className="text-xl font-semibold">{totalLarvae}</h2>
          </div>
        </div>
        {/* Charts Section */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded-xl shadow-md">
            <h2 className="text-lg font-semibold mb-4">Employee Standing - BSF Eggs Input (Grams)</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                {/* Render bars dynamically based on employee names */}
                {Object.keys(chartData[0] || {}).map((employeeName, index) => {
                  if (employeeName !== 'name') {
                    return (
                      <Bar key={employeeName} dataKey={employeeName} fill={index % 2 === 0 ? "#8884d8" : "#82ca9d"} />
                    );
                  }
                  return null;
                })}
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Static Data for Pupae and Larvae */}
          <div className="bg-white p-4 rounded-xl shadow-md">
            <h2 className="text-lg font-semibold mb-4">Pupae Standing - (kg)</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={pupaeStandingData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                {getEmployeeKeys(pupaeStandingData).map((key, index) => (
                  <Bar key={key} dataKey={key} fill={['#8884d8', '#82ca9d', '#ff7300', '#ffc658'][index % 4]} />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-md">
            <h2 className="text-lg font-semibold mb-4">Larvae Standing - (kg)</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={larvaeStandingData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                {getEmployeeKeys(larvaeStandingData).map((key, index) => (
                  <Bar key={key} dataKey={key} fill={['#8884d8', '#82ca9d', '#ff7300', '#ffc658'][index % 4]} />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
           <div className="bg-white p-4 rounded-xl shadow-md">
            <h2 className="text-lg font-semibold mb-4">Food Waste Standing - (kg)</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={foodwasteStandingData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                {getEmployeeKeys(foodwasteStandingData).map((key, index) => (
                  <Bar key={key} dataKey={key} fill={['#8884d8', '#82ca9d', '#ff7300', '#ffc658'][index % 4]} />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
           <div className="bg-white p-4 rounded-xl shadow-md">
            <h2 className="text-lg font-semibold mb-4">Pellets Standing - (kg)</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={pelletsStandingData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                {getEmployeeKeys(pelletsStandingData).map((key, index) => (
                  <Bar key={key} dataKey={key} fill={['#8884d8', '#82ca9d', '#ff7300', '#ffc658'][index % 4]} />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
           <div className="bg-white p-4 rounded-xl shadow-md">
            <h2 className="text-lg font-semibold mb-4">Fertilizer Standing</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={fertilizerStandingData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                {getEmployeeKeys(fertilizerStandingData).map((key, index) => (
                  <Bar key={key} dataKey={key} fill={['#8884d8', '#82ca9d', '#ff7300', '#ffc658'][index % 4]} />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Analytics;
