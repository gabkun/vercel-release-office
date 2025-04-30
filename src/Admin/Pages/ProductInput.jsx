import React, { useState, useEffect } from "react";
import Sidenavbar from "../../Admin Utilities/sidenavbar";
import AxiosInstance from "../../api/axiosConfig";
import { useNavigate } from "react-router-dom";
import {ProductInputModal} from "../Modals/productInputModal";

export const ProductInput = () => {
  const [productInputs, setProductInputs] = useState([]);
  const [products, setProducts] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const navigate = useNavigate();

  useEffect(() => {
    AxiosInstance.get("api/products/input/")
      .then((response) => {
        setProductInputs(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the product inputs:", error);
      });
  }, []);

  useEffect(() => {
    AxiosInstance.get("/api/products/")
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the products:", error);
      });
  }, []);

  const getProductName = (productId) => {
    const product = products.find((p) => p.id === productId);
    return product ? product.product_name : "Unknown Product";
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedData = [...productInputs].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  return (
    <div className="flex h-screen w-full">
      <div className="w-64 min-w-[16rem] border-r border-gray-200 bg-white">
        <Sidenavbar />
      </div>

      <div className="flex-1 p-6 overflow-auto">
        <h1 className="text-2xl font-bold mb-4">BSF Products Management</h1>
        <div className="flex flex-row space-x-4 mb-6">
          {/* Add Product Inputs Button */}
          <button
            onClick={() => setIsModalOpen(true)} // Open modal on button click
            className="mb-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded shadow"
          >
            + Add Product Inputs
          </button>
        </div>

        {/* Modal Component */}
        {isModalOpen && (
          <ProductInputModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSubmitSuccess={() => {
              // Optional: Fetch the data again or handle any logic after submitting
              setIsModalOpen(false);
            }}
          />
        )}

        <table className="min-w-full table-auto text-sm text-left text-gray-700">
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
            <tr>
              <th
                onClick={() => handleSort("firstname")}
                className="px-6 py-3 cursor-pointer hover:underline"
              >
                Employee{" "}
                {sortConfig.key === "firstname" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
              </th>
              <th
                onClick={() => handleSort("product_id")}
                className="px-6 py-3 cursor-pointer hover:underline"
              >
                Product Name{" "}
                {sortConfig.key === "product_id" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
              </th>
              <th
                onClick={() => handleSort("weight")}
                className="px-6 py-3 cursor-pointer hover:underline"
              >
                Weight{" "}
                {sortConfig.key === "weight" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
              </th>
              <th
                onClick={() => handleSort("timestamp")}
                className="px-6 py-3 cursor-pointer hover:underline"
              >
                Timestamp{" "}
                {sortConfig.key === "timestamp" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
              </th>
              <th
                onClick={() => handleSort("status")}
                className="px-6 py-3 cursor-pointer hover:underline"
              >
                Status{" "}
                {sortConfig.key === "status" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((input) => (
              <tr
                key={input.id}
                className={`border-b ${
                  input.status === 3
                    ? "bg-green-50"
                    : input.status === 2
                    ? "bg-red-50"
                    : "bg-yellow-50"
                }`}
              >
                <td className="px-6 py-4">{input.firstname}</td>
                <td className="px-6 py-4">{getProductName(input.product_id)}</td>
                <td className="px-6 py-4">{input.weight}</td>
                <td className="px-6 py-4">{new Date(input.timestamp).toLocaleString()}</td>
                <td className="px-6 py-4 font-medium">
                  {input.status === 3
                    ? "Accepted"
                    : input.status === 2
                    ? "Declined"
                    : "Pending"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
