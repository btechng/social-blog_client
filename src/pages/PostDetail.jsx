import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api";
import CommentList from "../components/CommentList.jsx";
import PostCard from "../components/PostCard.jsx";

export default function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      const res = await api.get("/posts/" + id);
      setPost(res.data);
    } catch (err) {
      console.error("Error loading post:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [id]);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "50vh",
        }}
      >
        <div
          style={{
            width: "32px",
            height: "32px",
            border: "4px solid #e5e7eb",
            borderTop: "4px solid #2563eb",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
          }}
        />
        <style>
          {`@keyframes spin { 
              from { transform: rotate(0deg);} 
              to { transform: rotate(360deg);} 
            }`}
        </style>
      </div>
    );
  }

  if (!post) {
    return (
      <div
        style={{
          textAlign: "center",
          marginTop: "40px",
          color: "#6b7280",
        }}
      >
        Post not found.
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "40px auto",
        padding: "0 16px",
      }}
    >
      {/* Post Section */}
      <div
        style={{
          background: "white",
          padding: "24px",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
          marginBottom: "32px",
        }}
      >
        <PostCard
          post={post}
          onEdit={() => {}}
          onDelete={() => {}}
          onLike={async () => {
            const res = await api.post("/posts/" + id + "/like");
            setPost(res.data);
          }}
        />
      </div>

      {/* Comments Section */}
      <div
        style={{
          background: "#f9fafb",
          padding: "24px",
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        }}
      >
        <h3
          style={{
            marginBottom: "16px",
            fontSize: "20px",
            fontWeight: "600",
            color: "#111827",
          }}
        >
          Comments
        </h3>
        <CommentList postId={id} />
      </div>
    </div>
  );
}
