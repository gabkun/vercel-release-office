import React, { useState, useEffect, useRef } from "react"; 
import Sidenavbar from "../../Admin Utilities/sidenavbar";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid
} from "recharts";
import axiosInstance from "../../api/axiosConfig";

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

// Helper: Get the Sunday date for the week of the given Monday date
const getSundayFromMonday = (monday) => {
  const sunday = new Date(monday);
  sunday.setDate(sunday.getDate() + 6);
  return sunday;
};

// Format date as yyyy-mm-dd
const formatDate = (date) => {
  const y = date.getFullYear();
  const m = (date.getMonth() + 1).toString().padStart(2, "0");
  const d = date.getDate().toString().padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const Analytics = () => {
  const [eggData, setEggData] = useState([]);
  const [pupaeStandingData, setPupaeStandingData] = useState([]);
  const [summaryData, setSummaryData] = useState({
    foodWaste: "Loading...",
    pupae: "Loading...",
    larvae: "Loading...",
    eggs: "Loading...",
    fertilizer: "Loading...",
    pellets: "Loading...",
  });
  const [bestEmployee, setBestEmployee] = useState("Loading...");
  const [pelletsStandingData, setPelletsStandingData] = useState([]);
  const [foodwasteStandingData, setFoodwasteStandingData] = useState([]);
  const [fertilizerStandingData, setFertilizerStandingData] = useState([]);
  const [larvaeStandingData, setLarvaeStandingData] = useState([]);

  const [filterType, setFilterType] = useState("daily");

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsSidebarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // New states for weekly date range (default to current week Mon-Sun)
  const today = new Date();
  const dayOfWeek = today.getDay(); // Sunday=0, Monday=1 ...
  // Calculate this week's Monday (if today is Sunday(0), go back 6 days)
  const thisMonday = new Date(today);
  thisMonday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
  const thisSunday = getSundayFromMonday(thisMonday);

  const [startDate, setStartDate] = useState(formatDate(thisMonday));
  const [endDate, setEndDate] = useState(formatDate(thisSunday));

  const transformData = (data) => {
    const dayMap = {};
    const employeeTotals = {};

    data.forEach((item) => {
      const { day, total_weight, firstname, surname } = item;
      const employeeName = `${firstname} ${surname}`;
      const weight = parseFloat(total_weight);

      if (!dayMap[day]) dayMap[day] = {};
      if (!dayMap[day][employeeName]) dayMap[day][employeeName] = 0;
      dayMap[day][employeeName] += weight;

      if (!employeeTotals[employeeName]) employeeTotals[employeeName] = 0;
      employeeTotals[employeeName] += weight;
    });

    const sortedEmployees = Object.keys(employeeTotals)
      .sort((a, b) => employeeTotals[b] - employeeTotals[a])
      .slice(0, 3);

    return daysOfWeek.map((day) => {
      const entry = { name: day };
      sortedEmployees.forEach((emp) => {
        entry[emp] = dayMap[day]?.[emp] || 0;
      });
      return entry;
    });
  };

  // Fetch summary data once on mount
  useEffect(() => {
    const fetchSummaryData = async () => {
      try {
        const [
          foodWasteRes,
          pupaeRes,
          larvaeRes,
          eggsRes,
          fertilizerRes,
          pelletsRes,
          bestEmployeeRes,
        ] = await Promise.all([
          axiosInstance.get("/api/foodwaste/today"),
          axiosInstance.get("/api/larpup/pupae/total"),
          axiosInstance.get("/api/larpup/larvae/total"),
          axiosInstance.get("/api/eggs/totaltoday"),
          axiosInstance.get("/api/fertilizer/today"),
          axiosInstance.get("/api/pellets/today"),
          axiosInstance.get("/api/users/best"),
        ]);

        setSummaryData({
          foodWaste: foodWasteRes.data.total_weight ?? "No Data Today",
          pupae: pupaeRes.data.total_weight ?? "No Data Today",
          larvae: larvaeRes.data.total_weight ?? "No Data Today",
          eggs: eggsRes.data.total_weight ?? "No Data Today",
          fertilizer: fertilizerRes.data.total_weight ?? "No Data Today",
          pellets: pelletsRes.data.total_weight ?? "No Data Today",
        });

        const best = bestEmployeeRes.data?.data;
        setBestEmployee(
          best && best.firstname && best.surname
            ? `${best.firstname} ${best.surname}`
            : "No approved inputs yet"
        );
      } catch (error) {
        console.error("Error fetching summary data:", error);
        setBestEmployee("Error loading");
      }
    };

    fetchSummaryData();
  }, []);

  // Fetch standing data on filterType or date range change
  useEffect(() => {
    const endpointMap = {
      daily: {
        eggs: "/api/eggs/eggsperday",
        pupae: "/api/larpup/pupae/perday",
        larvae: "/api/larpup/larvae/perday",
        foodwaste: "/api/foodwaste/getPerDay",
        fertilizer: "/api/fertilizer/getPerDay",
        pellets: "/api/pellets/getPerDay",
      },
      weekly: {
        eggs: "/api/eggs/eggsperweek",
        pupae: "/api/larpup/pupae/perweek",
        larvae: "/api/larpup/larvae/perweek",
        foodwaste: "/api/foodwaste/getPerWeek",
        fertilizer: "/api/fertilizer/getPerWeek",
        pellets: "/api/pellets/perweek",
      },
    };

    const endpoints = endpointMap[filterType];

    // Build params for weekly API calls
    const params =
      filterType === "weekly"
        ? { start_date: startDate, end_date: endDate }
        : {};
    const fetchAndSet = async (key, setState) => {
      try {
        let res;
        if (filterType === "weekly") {
          // POST request with body containing dates
          res = await axiosInstance.post(endpoints[key], {
            start_date: startDate,
            end_date: endDate,
          });
        } else {
          // GET request without body for daily
          res = await axiosInstance.get(endpoints[key]);
        }
        const formatted = transformData(res.data);
        setState(formatted);
      } catch (err) {
        console.error(`Error fetching ${key} data:`, err);
      }
    };

    fetchAndSet("eggs", setEggData);
    fetchAndSet("pupae", setPupaeStandingData);
    fetchAndSet("larvae", setLarvaeStandingData);
    fetchAndSet("foodwaste", setFoodwasteStandingData);
    fetchAndSet("fertilizer", setFertilizerStandingData);
    fetchAndSet("pellets", setPelletsStandingData);
  }, [filterType, startDate, endDate]);

  // Handle start date change - must be a Monday!
  const handleStartDateChange = (e) => {
    const newStartDate = new Date(e.target.value);
    if (newStartDate.getDay() !== 1) {
      alert("Start date must be a Monday");
      return;
    }
    setStartDate(formatDate(newStartDate));
    setEndDate(formatDate(getSundayFromMonday(newStartDate)));
  };

  const getEmployeeKeys = (data) => {
    if (!data.length) return [];
    const sample = data[0];
    return Object.keys(sample).filter((key) => key !== "name");
  };

  return (
    <>
     
      <div className="flex h-screen w-full">
        <div className="div">
          <div className="">
            <Sidenavbar />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-auto">
          <h1 className="text-2xl font-bold mb-6">Analytics Dashboard</h1>

          {/* Filter Selector */}
          <div className="mb-4 flex items-center gap-4">
            <label className="mr-2 font-medium">Filter by:</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="border px-2 py-1 rounded"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
            </select>

            {/* Show date pickers only if weekly */}
            {filterType === "weekly" && (
              <>
                <label className="ml-4 font-medium">Start Date (Monday):</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={handleStartDateChange}
                  className="border px-2 py-1 rounded"
                />
                <label className="ml-4 font-medium">End Date (Sunday):</label>
                <input
                  type="date"
                  value={endDate}
                  readOnly
                  className="border px-2 py-1 rounded bg-gray-100 cursor-not-allowed"
                />
              </>
            )}
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
            {/* ... your summary cards here ... same as before ... */}
            <div className="bg-white p-4 rounded-xl shadow-md">
              <p className="text-gray-600">Outstanding Employee</p>
              <h2 className="text-xl font-semibold">{bestEmployee}</h2>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-md">
              <p className="text-gray-600">Total BSF Eggs (Today)</p>
              <h2 className="text-xl font-semibold">
                {summaryData.eggs === "No Data Today"
                  ? "No Data Today"
                  : `${summaryData.eggs} g`}
              </h2>
            </div>
            {/* ... (rest of your summary cards unchanged) ... */}
            <div className="bg-white p-4 rounded-xl shadow-md">
              <p className="text-gray-600">Total BSF Pupae Input (Today)</p>
              <h2 className="text-xl font-semibold">
                {summaryData.pupae === "No Data Today"
                  ? "No Data Today"
                  : `${summaryData.pupae} kg`}
              </h2>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-md">
              <p className="text-gray-600">Total BSF Larvae Input (Today)</p>
              <h2 className="text-xl font-semibold">
                {summaryData.larvae === "No Data Today"
                  ? "No Data Today"
                  : `${summaryData.larvae} kg`}
              </h2>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-md">
              <p className="text-gray-600">Total Food Waste Inputs (Today)</p>
              <h2 className="text-xl font-semibold">
                {summaryData.foodWaste === "No Data Today"
                  ? "No Data Today"
                  : `${summaryData.foodWaste} kg`}
              </h2>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-md">
              <p className="text-gray-600">Total BSF Pellets Input (Today)</p>
              <h2 className="text-xl font-semibold">
                {summaryData.pellets === "No Data Today"
                  ? "No Data Today"
                  : `${summaryData.pellets} kg`}
              </h2>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-md">
              <p className="text-gray-600">Total Fertilizer Input (Today)</p>
              <h2 className="text-xl font-semibold">
                {summaryData.fertilizer === "No Data Today"
                  ? "No Data Today"
                  : `${summaryData.fertilizer} kg`}
              </h2>
            </div>
          </div>

          {/* Chart Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Eggs Chart */}
            <div className="bg-white rounded-xl shadow-md p-4">
              <h3 className="text-lg font-bold mb-4">Eggs</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={eggData}
                  margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  {getEmployeeKeys(eggData).map((key, index) => (
                    <Bar
                      key={key}
                      dataKey={key}
                      fill={
                        ["#8884d8", "#82ca9d", "#ff7300", "#ffc658"][index % 4]
                      }
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Pupae Chart */}
            <div className="bg-white rounded-xl shadow-md p-4">
              <h3 className="text-lg font-bold mb-4">Pupae</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={pupaeStandingData}
                  margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  {getEmployeeKeys(pupaeStandingData).map((key, index) => (
                    <Bar
                      key={key}
                      dataKey={key}
                      fill={
                        ["#8884d8", "#82ca9d", "#ff7300", "#ffc658"][index % 4]
                      }
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Larvae Chart */}
            <div className="bg-white rounded-xl shadow-md p-4">
              <h3 className="text-lg font-bold mb-4">Larvae</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={larvaeStandingData}
                  margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  {getEmployeeKeys(larvaeStandingData).map((key, index) => (
                    <Bar
                      key={key}
                      dataKey={key}
                      fill={
                        ["#8884d8", "#82ca9d", "#ff7300", "#ffc658"][index % 4]
                      }
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Food Waste Chart */}
            <div className="bg-white rounded-xl shadow-md p-4">
              <h3 className="text-lg font-bold mb-4">Food Waste</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={foodwasteStandingData}
                  margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  {getEmployeeKeys(foodwasteStandingData).map((key, index) => (
                    <Bar
                      key={key}
                      dataKey={key}
                      fill={
                        ["#8884d8", "#82ca9d", "#ff7300", "#ffc658"][index % 4]
                      }
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Pellets Chart */}
            <div className="bg-white rounded-xl shadow-md p-4">
              <h3 className="text-lg font-bold mb-4">Pellets</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={pelletsStandingData}
                  margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  {getEmployeeKeys(pelletsStandingData).map((key, index) => (
                    <Bar
                      key={key}
                      dataKey={key}
                      fill={
                        ["#8884d8", "#82ca9d", "#ff7300", "#ffc658"][index % 4]
                      }
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Fertilizer Chart */}
            <div className="bg-white rounded-xl shadow-md p-4">
              <h3 className="text-lg font-bold mb-4">Fertilizer</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={fertilizerStandingData}
                  margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  {getEmployeeKeys(fertilizerStandingData).map((key, index) => (
                    <Bar
                      key={key}
                      dataKey={key}
                      fill={
                        ["#8884d8", "#82ca9d", "#ff7300", "#ffc658"][index % 4]
                      }
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Analytics;