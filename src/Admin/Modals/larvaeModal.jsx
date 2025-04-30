import React, { useState } from 'react';
import { FaBug, FaLeaf, FaWeightHanging, FaCalendarAlt } from 'react-icons/fa';

export const LarvaeModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    employee_id: '',
    weight: '',
    date: '',
    input_type: '', // Start as empty
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'input_type' ? parseInt(value) : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  if (!isOpen) return null;

  const isLarvae = formData.input_type === 1;

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
          {isLarvae ? <FaBug className="text-green-600 text-2xl" /> : <FaLeaf className="text-orange-500 text-2xl" />}
          <h2 className="text-xl font-semibold text-gray-800">
            {isLarvae ? 'Submit Larvae Data' : 'Submit Pupae Data'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center gap-2 border rounded-lg p-2 focus-within:ring-2 ring-blue-300">
            <FaBug className="text-gray-500" />
            <input
              type="text"
              name="employee_id"
              placeholder="Employee ID"
              value={formData.employee_id}
              onChange={handleChange}
              required
              className="w-full outline-none"
            />
          </div>

          <div className="flex items-center gap-2 border rounded-lg p-2 focus-within:ring-2 ring-blue-300">
            <FaWeightHanging className="text-gray-500" />
            <input
              type="number"
              name="weight"
              placeholder="Weight in grams"
              value={formData.weight}
              onChange={handleChange}
              required
              className="w-full outline-none"
            />
          </div>

          <div className="flex items-center gap-2 border rounded-lg p-2 focus-within:ring-2 ring-blue-300">
            <FaCalendarAlt className="text-gray-500" />
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="w-full outline-none"
            />
          </div>

          <div className="flex items-center gap-2 border rounded-lg p-2 focus-within:ring-2 ring-blue-300">
            <select
              name="input_type"
              value={formData.input_type}
              onChange={handleChange}
              required
              className="w-full outline-none"
            >
              <option value="" disabled>Select Input Type</option>
              <option value={1}>Larvae</option>
              <option value={2}>Pupae</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition duration-200"
          >
            Submit {isLarvae ? 'Larvae' : 'Pupae'}
          </button>
        </form>
      </div>
    </div>
  );
};
