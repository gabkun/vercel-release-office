import React, { useState } from 'react';
import { FaUserTag, FaStickyNote } from 'react-icons/fa';
import axiosInstance from '../../api/axiosConfig';

export const MiscModal = ({ isOpen, onClose, onSubmitSuccess, employees }) => {
  const [formData, setFormData] = useState({
    employee_id: '',
    note: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axiosInstance.post('/api/misc/create', formData);
      onSubmitSuccess && onSubmitSuccess();
      onClose();
    } catch (error) {
      console.error('Failed to submit misc note:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-lg relative animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-500 hover:text-red-600 text-xl font-bold"
        >
          ×
        </button>

        <div className="flex items-center gap-3 mb-6">
          <FaStickyNote className="text-blue-600 text-2xl" />
          <h2 className="text-xl font-semibold text-gray-800">Add Additional Remarks</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center gap-2 border rounded-lg p-2 focus-within:ring-2 ring-blue-300">
            <FaUserTag className="text-gray-500" />
            <select
              name="employee_id"
              value={formData.employee_id}
              onChange={handleChange}
              required
              className="w-full outline-none bg-white"
            >
              <option value="">Select Employee</option>
              {employees.map(emp => (
                <option key={emp.employee_id} value={emp.employee_id}>
                  {emp.firstname} {emp.surname}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 border rounded-lg p-2 focus-within:ring-2 ring-blue-300">
            <FaStickyNote className="text-gray-500" />
            <textarea
              name="note"
              placeholder="Enter note"
              value={formData.note}
              onChange={handleChange}
              required
              className="w-full outline-none resize-none"
              rows="3"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition duration-200"
          >
            Submit Note
          </button>
        </form>
      </div>
    </div>
  );
};
