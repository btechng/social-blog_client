import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../context/AuthContext.jsx";

export default function Profile() {
  const { id } = useParams();
  const { user } = useAuth();
  const isOwner = user && user._id === id;

  const [userData, setUserData] = useState(null);
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef();

  async function load() {
    const res = await api.get("/users/" + id);
    setUserData(res.data);
    setBio(res.data.bio || "");
    setAvatar(res.data.avatarUrl || "");
  }

  useEffect(() => {
    load();
  }, [id]);

  async function handleAvatarUpload(file) {
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "social_blog_upload");
    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dkjvfszog/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await res.json();
      setAvatar(data.secure_url);
    } catch (err) {
      alert("Upload failed");
    }
    setUploading(false);
  }

  function handleDrop(e) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleAvatarUpload(file);
  }

  async function save() {
    const res = await api.put("/users/" + id, { bio, avatarUrl: avatar });
    setUserData(res.data);
    alert("Profile updated!");
  }

  if (!userData) return <div>Loading...</div>;

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "16px" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "12px",
          background: "#fff",
          padding: "24px",
          borderRadius: "12px",
          boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
        }}
      >
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          style={{
            width: "120px",
            height: "120px",
            borderRadius: "50%",
            overflow: "hidden",
            cursor: "pointer",
            border: "2px dashed #d1d5db",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: avatar
              ? `url(${avatar}) center/cover no-repeat`
              : "#f3f4f6",
          }}
          onClick={() => fileInputRef.current.click()}
          title="Click or drag image to upload"
        >
          {!avatar && (uploading ? "Uploading..." : "Upload")}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          style={{ display: "none" }}
          accept="image/*"
          onChange={(e) => handleAvatarUpload(e.target.files[0])}
        />
        <h2 style={{ margin: 0 }}>@{userData.username}</h2>
        <p>{userData.bio}</p>

        {isOwner && (
          <div style={{ width: "100%", marginTop: "16px" }}>
            <h3>Edit Profile</h3>
            <textarea
              placeholder="Bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #d1d5db",
                resize: "vertical",
                fontSize: "14px",
              }}
            />
            <button
              onClick={save}
              style={{
                marginTop: "12px",
                padding: "12px 16px",
                borderRadius: "8px",
                border: "none",
                background: "#2563eb",
                color: "#fff",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              Save Changes
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
