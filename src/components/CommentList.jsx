import React, { useEffect, useState } from "react";
import { api } from "../api";
import { useAuth } from "../context/AuthContext.jsx";

export default function CommentList({ postId }) {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const { user } = useAuth();

  async function load(p = 1) {
    const res = await api.get(
      "/comments/post/" + postId + `?page=${p}&limit=10`
    );
    setComments(res.data.data);
    setPage(res.data.page);
    setPages(res.data.pages);
  }

  useEffect(() => {
    load(1);
  }, [postId]);

  async function add() {
    if (!text.trim()) return;
    await api.post("/comments/post/" + postId, { content: text });
    await load(pages);
    setText("");
  }

  return (
    <div style={{ marginTop: "16px" }}>
      <h4 style={{ marginBottom: "8px" }}>Comments</h4>
      {comments.map((c) => (
        <div
          key={c._id}
          style={{
            borderTop: "1px solid #e5e7eb",
            paddingTop: "8px",
            marginTop: "8px",
          }}
        >
          <strong>{c.author?.username}</strong>
          <div>{c.content}</div>
        </div>
      ))}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "12px",
          marginTop: 12,
        }}
      >
        <button
          disabled={page <= 1}
          onClick={() => load(page - 1)}
          style={pagerBtn}
        >
          Prev
        </button>
        <span style={{ alignSelf: "center" }}>
          Page {page} / {pages}
        </span>
        <button
          disabled={page >= pages}
          onClick={() => load(page + 1)}
          style={pagerBtn}
        >
          Next
        </button>
      </div>
      {user && (
        <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write a comment..."
            style={{
              flex: 1,
              padding: "8px",
              borderRadius: "6px",
              border: "1px solid #d1d5db",
            }}
          />
          <button
            onClick={add}
            style={{ ...pagerBtn, background: "#2563eb", color: "#fff" }}
          >
            Send
          </button>
        </div>
      )}
    </div>
  );
}

const pagerBtn = {
  padding: "8px 12px",
  borderRadius: "6px",
  border: "1px solid #d1d5db",
  background: "#f3f4f6",
  cursor: "pointer",
  transition: "background 0.2s",
};
