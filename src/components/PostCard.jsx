import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function PostCard({ post, onEdit, onDelete, onLike }) {
  const { user } = useAuth();
  const isAuthor = user && post.author && user._id === post.author._id;

  return (
    <div
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: "12px",
        padding: "16px",
        marginBottom: "16px",
        background: "#fff",
        boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginBottom: "8px",
        }}
      >
        <img
          src={post.author?.avatarUrl || "https://placehold.co/40"}
          width={40}
          height={40}
          style={{ borderRadius: "50%" }}
        />
        <strong>{post.author?.username}</strong>
      </div>
      <h3 style={{ fontSize: "18px", marginBottom: "8px", color: "#111827" }}>
        {post.title}
      </h3>
      {post.imageUrl && (
        <img
          src={post.imageUrl}
          style={{ maxWidth: "100%", borderRadius: "8px", marginBottom: "8px" }}
        />
      )}
      <div
        dangerouslySetInnerHTML={{ __html: post.content }}
        style={{ marginBottom: "12px" }}
      />
      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
        <button onClick={() => onLike(post)} style={cardButtonStyle}>
          ❤ {post.likes?.length || 0}
        </button>
        <Link to={`/post/${post._id}`} style={cardLinkStyle}>
          Comments
        </Link>
        {isAuthor && (
          <button onClick={() => onEdit(post)} style={cardButtonStyle}>
            Edit
          </button>
        )}
        {isAuthor && (
          <button onClick={() => onDelete(post)} style={cardButtonStyle}>
            Delete
          </button>
        )}
      </div>
    </div>
  );
}

const cardButtonStyle = {
  padding: "8px 12px",
  borderRadius: "6px",
  border: "1px solid #d1d5db",
  background: "#f3f4f6",
  cursor: "pointer",
  transition: "background 0.2s",
};

const cardLinkStyle = {
  textDecoration: "none",
  padding: "8px 12px",
  borderRadius: "6px",
  background: "#e0f2fe",
  color: "#0369a1",
  fontWeight: 500,
  cursor: "pointer",
};
