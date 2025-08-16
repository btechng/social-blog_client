import React, { useState } from "react";
import { api } from "../api";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export default function PostEditor({ onSaved }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  async function handleImageUpload(file) {
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
      setImage(data.secure_url);
    } catch (err) {
      alert("Upload failed");
    }
    setUploading(false);
  }

  async function submit(e) {
    e.preventDefault();
    const res = await api.post("/posts", { title, content, imageUrl: image });
    onSaved(res.data);
    setTitle("");
    setContent("");
    setImage(null);
  }

  return (
    <form
      onSubmit={submit}
      style={{
        background: "#fff",
        padding: "16px",
        borderRadius: "12px",
        marginBottom: "16px",
        boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
      }}
    >
      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        style={{
          width: "100%",
          padding: "12px",
          borderRadius: "8px",
          border: "1px solid #d1d5db",
          marginBottom: "12px",
          fontSize: "16px",
        }}
      />
      <ReactQuill value={content} onChange={setContent} />
      <div
        style={{
          marginTop: "12px",
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleImageUpload(e.target.files[0])}
        />
        {uploading && <span>Uploading...</span>}
        {image && (
          <img
            src={image}
            alt="preview"
            style={{ width: "80px", borderRadius: "8px" }}
          />
        )}
      </div>
      <button
        type="submit"
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
        Post
      </button>
    </form>
  );
}
