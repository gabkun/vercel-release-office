import React, { useState } from "react";

const ProfilePictureUpload = ({ onFileSelect }) => {
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      onFileSelect(file);
      console.log("Selected file:", file.name); // Log the file name
    }
  };

  return (
    <div className="profile-picture-section">
      <label htmlFor="profileUpload" style={{ cursor: "pointer" }}>
        <div
          style={{
            width: 150,
            height: 150,
            borderRadius: "50%",
            border: "2px dashed #ccc",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            marginBottom: "1rem",
          }}
        >
          {preview ? (
            <img
              src={preview}
              alt="Profile Preview"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <span>Upload Photo</span>
          )}
        </div>
      </label>
      <input
        type="file"
        id="profileUpload"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
    </div>
  );
};

export default ProfilePictureUpload;
