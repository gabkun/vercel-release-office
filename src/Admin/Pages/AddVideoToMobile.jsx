import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosConfig";
import Sidenavbar from "../../Admin Utilities/sidenavbar";

export const AddVideoToMobile = () => {
  const navigate = useNavigate();

  /*
   ****************************************************
   **  🚫 INDI PAG I-CHANGE MAYO!                    **
   **  👉 OR ELSE DI KO MA-INCHINDIHAN NA 😤         **
   **  test all you want lang                         **
   ****************************************************
   */


  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [facebookLink, setFacebookLink] = useState("");
  const [tiktokLink, setTiktokLink] = useState("");
  const [youtubeLink, setYoutubeLink] = useState("");
  const [imageSrc, setImageSrc] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [responseMessage, setResponseMessage] = useState("");

  const removeImage = () => {
    setImageSrc(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageSrc(URL.createObjectURL(file));
      setImageFile(file);
    }
  };

  const getDataLinks = async (event) => {
    // kwa data kung ano gin upload balik di sa FE gab
    const response = await axiosInstance.get("/api/video/getvids");
    if (response.data.success) {
      console.log(response);
    }
  };

  const handlePost = async (event) => {
    const payload = new FormData();

    payload.append("image", imageFile);
    payload.append("title", title);
    payload.append("date", date);
    payload.append("facebookLink", facebookLink);
    payload.append("tiktokLink", tiktokLink);
    payload.append("youtubeLink", youtubeLink);

    console.log(payload);
    try {
      const response = await axiosInstance.post("/api/video/addvids", payload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      // console.log(response)
      if (response.data.success) {
        setTitle("");
        setDate("");
        setFacebookLink("");
        setTiktokLink("");
        setYoutubeLink("");
        setImageFile(null);
        setImageSrc(null);
        setResponseMessage("success");
        console.log(response.data.success);
      }
    } catch (err) {
      console.log(err);
      setResponseMessage("Something went wrong.");
    }
  };

  return (
    <>
      <div className="flex flex-row h-screen w-full">
        <div className="div">
          <div>
            <Sidenavbar />
          </div>
        </div>
        <div className="flex justify-center items-center w-full">
          <div className="w-full max-w-4xl bg-green-500 p-4 flex gap-4">
            <div className="relative w-1/3 h-64 border rounded overflow-hidden bg-yellow-400 flex items-center justify-center">
              {imageSrc ? (
                <>
                  <img
                    src={imageSrc}
                    alt="Preview"
                    className="object-cover w-full h-full"
                  />
                  <button
                    onClick={removeImage}
                    className="absolute top-2 right-2 bg-white text-black rounded-full w-6 h-6 flex items-center justify-center font-bold hover:bg-red-500 hover:text-white"
                  >
                    ×
                  </button>
                </>
              ) : (
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="text-sm file:bg-white file:text-black file:border-none file:p-2"
                />
              )}
            </div>

            <div className="flex flex-col justify-center gap-4 flex-1">
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="bg-purple-700 text-white px-2 py-1 w-1/2 rounded"
              />

              <input
                type="text"
                placeholder="Enter title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-red-600 text-white px-2 py-2 w-full rounded"
              />

              <input
                type="text"
                value={facebookLink}
                placeholder="Facebook Link"
                onChange={(e) => setFacebookLink(e.target.value)}
                className="bg-blue-700 text-white px-2 py-2 w-11/12 rounded"
              />
              <input
                type="text"
                value={youtubeLink}
                onChange={(e) => setYoutubeLink(e.target.value)}
                placeholder="YouTube Link"
                className="bg-blue-700 text-white px-2 py-2 w-11/12 rounded"
              />
              <input
                type="text"
                value={tiktokLink}
                placeholder="Tiktok Link"
                onChange={(e) => setTiktokLink(e.target.value)}
                className="bg-blue-700 text-white px-2 py-2 w-11/12 rounded"
              />

              <button type="submit" onClick={handlePost}>
                Create Post
              </button>
            </div>
          </div>
        </div>
        {responseMessage && (
          <p className="text-white mt-2">{responseMessage}</p>
        )}
      </div>
    </>
  );
}