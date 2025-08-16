import React, { useEffect, useState } from "react";
import { api } from "../api";
import { useAuth } from "../context/AuthContext.jsx";
import PostCard from "../components/PostCard.jsx";
import PostEditor from "../components/PostEditor.jsx";

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [q, setQ] = useState("");
  const { user } = useAuth();

  async function load(p = 1, query = "") {
    const res = await api.get("/posts", {
      params: { page: p, limit: 10, q: query },
    });
    setPosts(res.data.data);
    setPage(res.data.page);
    setPages(res.data.pages);
  }

  useEffect(() => {
    load(1, "");
  }, []);

  function onSaved(p) {
    setPosts([p, ...posts]);
  }

  async function onEdit(p) {
    const title = prompt("New title", p.title);
    const content = prompt("New content (HTML allowed)", p.content);
    if (title == null || content == null) return;
    const res = await api.put("/posts/" + p._id, {
      title,
      content,
      imageUrl: p.imageUrl,
    });
    setPosts(posts.map((x) => (x._id === p._id ? res.data : x)));
  }

  async function onDelete(p) {
    if (!confirm("Delete this post?")) return;
    await api.delete("/posts/" + p._id);
    setPosts(posts.filter((x) => x._id !== p._id));
  }

  async function onLike(p) {
    const res = await api.post("/posts/" + p._id + "/like");
    setPosts(posts.map((x) => (x._id === p._id ? res.data : x)));
  }

  // Debounced search
  useEffect(() => {
    const t = setTimeout(() => load(1, q), 400);
    return () => clearTimeout(t);
  }, [q]);

  return (
    <div>
      {user && <PostEditor onSaved={onSaved} />}
      <input
        placeholder="Search posts..."
        value={q}
        onChange={(e) => setQ(e.target.value)}
        style={{
          width: "100%",
          padding: "12px",
          marginBottom: "16px",
          borderRadius: "8px",
          border: "1px solid #d1d5db",
          fontSize: "16px",
        }}
      />
      {posts.map((p) => (
        <PostCard
          key={p._id}
          post={p}
          onEdit={onEdit}
          onDelete={onDelete}
          onLike={onLike}
        />
      ))}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "12px",
          marginTop: 16,
        }}
      >
        <button
          disabled={page <= 1}
          onClick={() => load(page - 1, q)}
          style={pagerButtonStyle}
        >
          Prev
        </button>
        <span style={{ alignSelf: "center" }}>
          Page {page} / {pages}
        </span>
        <button
          disabled={page >= pages}
          onClick={() => load(page + 1, q)}
          style={pagerButtonStyle}
        >
          Next
        </button>
      </div>
    </div>
  );
}

const pagerButtonStyle = {
  padding: "8px 14px",
  borderRadius: "6px",
  border: "1px solid #d1d5db",
  background: "#f3f4f6",
  cursor: "pointer",
  transition: "background 0.2s",
};
