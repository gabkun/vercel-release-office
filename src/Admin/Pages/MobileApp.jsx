import React, { useEffect, useState } from "react";
import Sidenavbar from "../../Admin Utilities/sidenavbar";
import { FaBoxOpen } from "react-icons/fa";
import { MdLocationOn, MdPhone } from "react-icons/md";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { FaDrumstickBite, FaBreadSlice, FaEgg, FaOilCan } from "react-icons/fa";
import {FaBottleWater, FaBoxTissue } from "react-icons/fa6";
import { GiMilkCarton , GiSaucepan, GiFruitBowl   } from "react-icons/gi";
import { BsFillBoxSeamFill } from "react-icons/bs";
import { TbBottle } from "react-icons/tb"; // For Soy Sauce / Ketchup
import { TbCalendar } from "react-icons/tb"; // For Soy Sauce / Ketchup
import { TbGps } from "react-icons/tb"; // For Soy Sauce / Ketchup

export const MobileApp = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [encodes, setEncodes] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEncodeId, setSelectedEncodeId] = useState(null);


  useEffect(() => {
    fetch("https://backend-bioflyt-402579879370.asia-east1.run.app/api/encode/allpending")
      .then((res) => res.json())
      .then((data) => setEncodes(data))
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  const openModal = (items, id) => {
    if (!id) {
      console.error("Encode ID is missing!");
      return;
    }
    setSelectedItems(items);
    setSelectedEncodeId(id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedItems([]);
  };

  const handleApprove = async () => {
    try {
      const res = await fetch('https://backend-bioflyt-402579879370.asia-east1.run.app/api/encode/approve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: selectedEncodeId })
      });
  
      const data = await res.json();
  
      if (res.ok) {
        alert('Encode approved successfully!');
        closeModal();
        // Optionally reload or remove item from state
      } else {
        alert(data.message || 'Failed to approve encode.');
      }
    } catch (err) {
      console.error('Approval error:', err);
      alert('Something went wrong while approving.');
    }
  };
  
  console.log(selectedEncodeId)
  

  return (
    <div className="flex h-screen w-full">
      {/* Sidebar */}
      <div className="w-64 min-w-[16rem] border-r border-gray-200 bg-white">
        <Sidenavbar />
      </div>

      {/* Content */}
      <div className="flex-1 bg-gray-100 p-6 overflow-auto">
        <h1 className="text-2xl font-bold mb-6">BioFlyt Mobile App Dashboard</h1>

        {encodes.map((encode, index) => (
          <div
            key={index}
            className="bg-white shadow-md rounded-lg p-4 mb-4 border-l-4 border-yellow-500"
          >
            <div className="text-lg font-semibold mb-2 flex items-center gap-2">
              <FaBoxOpen className="text-yellow-600" />
              Company: {encode.compname}
            </div>

            <div className="text-sm mb-1 flex items-center gap-2">
              <IoMdInformationCircleOutline className="text-blue-600" />
              Status: <span className="ml-1 font-medium text-yellow-700">Pending</span>
            </div>

            <div className="text-sm mb-1 flex items-center gap-2">
              <MdLocationOn className="text-green-600" />
              Address: {encode.compaddress}
            </div>

            <div className="text-sm mb-1 flex items-center gap-2">
              <MdPhone className="text-purple-600" />
              Contact: {encode.compnum}
            </div>


            <div className="text-sm mb-1 flex items-center gap-2">
              <TbGps className="text-purple-600" />
              Tracking ID: {encode.tracking_id}
            </div>
          
              <div className="text-sm mb-1 flex items-center gap-2 font-bold">
              <TbCalendar className="text-purple-600 " />
              Date: {encode.date}
            </div>
            <button
  onClick={() => openModal(encode.items, encode.encode_id)} // passing encode.id here
  className="mt-3 px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
>
  View Items
</button>
          </div>
        ))}

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-xl shadow-lg p-6 w-[90%] max-w-md">
              <h2 className="text-xl font-bold mb-4">Item Collection</h2>
              <ul className="space-y-2 max-h-64 overflow-y-auto">
  {selectedItems.map((item, i) => {
    let Icon;
    switch (item.name.toLowerCase()) {
      case "animal meat":
        Icon = FaDrumstickBite;
        break;
      case "bread":
        Icon = FaBreadSlice;
        break;
      case "ketchup":
        Icon = GiSaucepan;
        break;
      case "soy sauce":
        Icon = TbBottle;
        break;
      case "vinegar":
        Icon = FaBottleWater ;
        break;
      case "spoiled dairy":
        Icon = GiMilkCarton;
        break;
      case "oil":
        Icon = FaOilCan;
        break;
      case "egg shells":
        Icon = FaEgg;
        break;
      case "tissue":
        Icon = FaBoxTissue ;
        break;
        case "Fruits And Vegetables":
          Icon = GiFruitBowl ;
          break;
      default:
        Icon = GiFruitBowl;
    }

    return (
      <li key={i} className="border p-3 rounded-md shadow-sm">
        <p className="font-semibold flex items-center gap-2">
          <Icon className="text-yellow-600" />
          {item.name}
        </p>
        {item.total && (
          <p className="text-sm flex items-center gap-2">
            <IoMdInformationCircleOutline className="text-blue-600" />
            Total: {item.total}
          </p>
        )}
        {item.type && (
          <p className="text-sm flex items-center gap-2">
            <GiSaucepan className="text-red-600" />
            Type: {item.type}
          </p>
        )}
        {item.container && (
          <p className="text-sm flex items-center gap-2">
            <BsFillBoxSeamFill className="text-green-600" />
            Container: {item.container}
          </p>
        )}
      </li>
    );
  })}
</ul>
<button
    onClick={handleApprove}
    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
  >
    Approve
  </button>
  <button
    onClick={closeModal}
    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
  >
    Close
  </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
