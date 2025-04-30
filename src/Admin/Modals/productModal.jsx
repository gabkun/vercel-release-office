import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosConfig";


const ProductModal = ({ setIsModalOpen }) => {
    const [productName, setProductName] = useState("");
    const navigate = useNavigate()
  
    const handleClose = () => {
      setIsModalOpen(false); // Close the modal
    };
  
    const handleSubmit = async () => {
      try {
        // POST request to add a new product
        const response = await axiosInstance.post("/api/products/create", {
          product_name: productName,
        });
  
        // If the request is successful, close the modal
        if (response.status === 200 || response.status === 201) {
          console.log("Product added successfully:", response.data);
          navigate(0)
          setIsModalOpen(false); // Close the modal after successful submission
        }
      } catch (error) {
        console.error("Error adding product:", error);
      }
    };
  
    return (
      <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
        <div className="bg-white p-6 rounded shadow-md w-1/3">
          <h2 className="text-xl font-bold mb-4">Add Product</h2>
          <div>
            <label className="block text-sm font-medium mb-2">Product Name</label>
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="w-full px-4 py-2 border rounded mb-4"
              placeholder="Enter product name"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              onClick={handleClose}
              className="px-4 py-2 bg-gray-500 text-white rounded"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-green-500 text-white rounded"
            >
              Add Product
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  export default ProductModal;