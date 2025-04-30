import React, { useState } from 'react';
import axiosInstance from '../api/axiosConfig';
import { format } from 'date-fns';
import { CalendarDays, Clock, User } from 'lucide-react';

export const EmployeeHours = () => {
    const [employeeId, setEmployeeId] = useState('');
    const [dailyHours, setDailyHours] = useState([]);
    const [weeklyHours, setWeeklyHours] = useState([]);
    const [monthlyHours, setMonthlyHours] = useState([]);

    const handleSubmit = async () => {
        if (!employeeId) return;

        try {
            const [dailyRes, weeklyRes, monthlyRes] = await Promise.all([
                axiosInstance.get(`/api/attendance/hours/daily/${employeeId}`),
                axiosInstance.get(`/api/attendance/hours/weekly/${employeeId}`),
                axiosInstance.get(`/api/attendance/hours/monthly/${employeeId}`)
            ]);

            setDailyHours(dailyRes.data);
            setWeeklyHours(weeklyRes.data);
            setMonthlyHours(monthlyRes.data);
        } catch (err) {
            console.error("Failed to fetch employee hours:", err.response?.data || err.message);
        }
    };

    return (
        <div className="flex h-screen bg-gray-50">
          

            {/* Main Content */}
            <div className="flex-1 p-6">
                {/* Top Bar */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-green-900">BioFlyt Employee Date Time Record</h1>
                    <p className="text-sm text-gray-500">{format(new Date(), 'PPP')}</p>
                </div>

                {/* Employee ID Input */}
                <div className="flex items-center space-x-4 mb-8 max-w-xl">
                    <input
                        type="text"
                        value={employeeId}
                        onChange={(e) => setEmployeeId(e.target.value)}
                        placeholder="Enter Employee ID (e.g. RSN152)"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        onClick={handleSubmit}
                        className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg shadow"
                    >
                        Submit
                    </button>
                </div>

                {/* Time Cards */}
                <div className="space-y-8">
                    {/* Daily Hours */}
                    <div>
                        <div className="flex justify-between items-center bg-blue-100 px-4 py-2 rounded-md">
                            <h2 className="text-blue-800 font-semibold">Today</h2>
                            <span className="text-sm text-gray-600">
                                Total: {dailyHours.reduce((acc, cur) => acc + parseFloat(cur.hours_worked || 0), 0)} hrs
                            </span>
                        </div>
                        <div className="bg-white shadow rounded-lg p-4 space-y-2">
                            {dailyHours.map((item, index) => (
                                <div key={index} className="flex justify-between items-center border-b py-2">
                                    <div>
                                        <p className="font-medium">{item.task || 'Task'}</p>
                                        <p className="text-sm text-gray-500">{format(new Date(item.date), 'PPP')}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-blue-700">{item.hours_worked} hrs</p>
                                        <p className="text-sm text-gray-400">{item.time_range || ''}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Weekly Hours */}
                    <div>
                        <div className="flex justify-between items-center bg-purple-100 px-4 py-2 rounded-md">
                            <h2 className="text-purple-800 font-semibold">This Week</h2>
                            <span className="text-sm text-gray-600">
                                Total: {weeklyHours.reduce((acc, cur) => acc + parseFloat(cur.hours_worked || 0), 0)} hrs
                            </span>
                        </div>
                        <div className="bg-white shadow rounded-lg p-4 space-y-2">
                            {weeklyHours.map((item, index) => (
                                <div key={index} className="border-b py-2">
                                    <p className="font-medium">
                                        {format(new Date(item.week_start), 'PPP')} - {format(new Date(item.week_end), 'PPP')}
                                    </p>
                                    <p className="text-sm text-purple-700 font-bold">{item.hours_worked} hrs</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Monthly Hours */}
                    <div>
                        <div className="flex justify-between items-center bg-green-100 px-4 py-2 rounded-md">
                            <h2 className="text-green-800 font-semibold">This Month</h2>
                            <span className="text-sm text-gray-600">
                                Total: {monthlyHours.reduce((acc, cur) => acc + parseFloat(cur.hours_worked || 0), 0)} hrs
                            </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                            {monthlyHours.map((item, index) => (
                                <div key={index} className="bg-white shadow rounded-lg p-4">
                                    <p className="text-gray-700 font-medium">{item.month} {item.year}</p>
                                    <p className="text-green-700 font-bold text-lg">{item.hours_worked} hrs</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
