import React, { useState, useEffect } from 'react';
import { FaBox, FaUserTag, FaWeightHanging } from 'react-icons/fa';
import axiosInstance from '../../api/axiosConfig';

export const ProductInputModal = ({ isOpen, onClose, onSubmitSuccess }) => {
  const [formData, setFormData] = useState({
    product_id: '',
    employee_id: '',
    weight: '',
  });
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (isOpen) {
      // Fetch the product list when modal is opened
      axiosInstance.get('/api/products/')
        .then(response => {
          setProducts(response.data);
        })
        .catch(error => {
          console.error('Failed to fetch products:', error);
        });
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axiosInstance.post('/api/products/input/create', {
        ...formData,
        weight: Number(formData.weight),
      });

      if (onSubmitSuccess) onSubmitSuccess();
      onClose();
    } catch (error) {
      console.error('Failed to submit product input:', error);
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
          <FaBox className="text-blue-600 text-2xl" />
          <h2 className="text-xl font-semibold text-gray-800">Add Product Input</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center gap-2 border rounded-lg p-2 focus-within:ring-2 ring-blue-300">
            <FaBox className="text-gray-500" />
            <select
              name="product_id"
              value={formData.product_id}
              onChange={handleChange}
              required
              className="w-full outline-none"
            >
              <option value="">Select Product</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.product_name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 border rounded-lg p-2 focus-within:ring-2 ring-blue-300">
            <FaUserTag className="text-gray-500" />
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

          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition duration-200"
          >
            Submit Product Input
          </button>
        </form>
      </div>
    </div>
  );
};
