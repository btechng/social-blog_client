import React, { useEffect, useRef, useState } from "react";
import { api } from "../api";
import { useAuth } from "../context/AuthContext.jsx";
import { io } from "socket.io-client";

export default function Chat() {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [active, setActive] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Scroll to bottom
  const scrollToBottom = () =>
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => {
    socketRef.current = io(
      import.meta.env.VITE_API_BASE || "http://localhost:5000"
    );
    socketRef.current.emit("join", user._id);
    return () => socketRef.current.disconnect();
  }, [user._id]);

  useEffect(() => {
    if (!active) return;
    const room = [user._id, active].sort().join(":");
    socketRef.current.emit("dm:join", { me: user._id, other: active });

    const handler = (msg) => {
      const a = [msg.from, msg.to].map(String);
      if (a.includes(user._id) && a.includes(active))
        setMessages((prev) => [...prev, msg]);
    };

    socketRef.current.on("dm:new", handler);
    return () => socketRef.current.off("dm:new", handler);
  }, [active, user._id]);

  async function doSearch(q) {
    const res = await api.get("/users", { params: { search: q, limit: 10 } });
    setUsers(res.data.filter((u) => u._id !== user._id));
  }

  useEffect(() => {
    const t = setTimeout(() => doSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  async function openThread(u) {
    setActive(u._id);
    const res = await api.get(`/chat/${u._id}?page=1&limit=50`);
    setMessages(res.data.data);
  }

  async function send() {
    if (!text.trim() || !active) return;
    const res = await api.post(`/chat/${active}`, { content: text });
    setMessages((prev) => [...prev, res.data]);
    setText("");
  }

  useEffect(scrollToBottom, [messages]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        gap: "12px",
        padding: "12px",
      }}
    >
      <div
        style={{
          display: "flex",
          flex: 1,
          minHeight: 0,
          gap: "12px",
          flexWrap: "wrap",
        }}
      >
        {/* Users list */}
        <div
          style={{
            width: "280px",
            flexShrink: 0,
            border: "1px solid #eee",
            borderRadius: "12px",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
        >
          <input
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              padding: "12px",
              border: "none",
              borderBottom: "1px solid #ddd",
              fontSize: "14px",
              outline: "none",
            }}
          />
          <div style={{ overflowY: "auto", flex: 1 }}>
            {users.map((u) => (
              <div
                key={u._id}
                onClick={() => openThread(u)}
                style={{
                  padding: "8px 12px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  background: active === u._id ? "#f3f4f6" : "transparent",
                  transition: "background 0.2s",
                }}
              >
                <img
                  src={u.avatarUrl || "https://placehold.co/32"}
                  width={32}
                  height={32}
                  style={{ borderRadius: "50%", objectFit: "cover" }}
                />
                <strong style={{ fontSize: "14px" }}>@{u.username}</strong>
              </div>
            ))}
          </div>
        </div>

        {/* Chat window */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            border: "1px solid #eee",
            borderRadius: "12px",
            overflow: "hidden",
            minHeight: "400px",
            background: "#fff",
          }}
        >
          {!active ? (
            <div
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#6b7280",
              }}
            >
              Select a user to chat.
            </div>
          ) : (
            <>
              <div style={{ flex: 1, padding: "12px", overflowY: "auto" }}>
                {messages.map((m) => (
                  <div
                    key={m._id}
                    style={{
                      display: "flex",
                      justifyContent:
                        String(m.from) === String(user._id)
                          ? "flex-end"
                          : "flex-start",
                      marginBottom: "8px",
                    }}
                  >
                    <span
                      style={{
                        maxWidth: "70%",
                        padding: "8px 12px",
                        borderRadius: "16px",
                        background:
                          String(m.from) === String(user._id)
                            ? "#2563eb"
                            : "#f3f4f6",
                        color:
                          String(m.from) === String(user._id) ? "#fff" : "#111",
                        wordBreak: "break-word",
                        fontSize: "14px",
                      }}
                    >
                      {m.content}
                    </span>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              <div
                style={{
                  display: "flex",
                  padding: "12px",
                  borderTop: "1px solid #eee",
                  gap: "8px",
                }}
              >
                <input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Type a message..."
                  style={{
                    flex: 1,
                    padding: "12px",
                    borderRadius: "12px",
                    border: "1px solid #d1d5db",
                    outline: "none",
                    fontSize: "14px",
                  }}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
                />
                <button
                  onClick={send}
                  style={{
                    padding: "12px 16px",
                    borderRadius: "12px",
                    background: "#2563eb",
                    color: "#fff",
                    border: "none",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                >
                  Send
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
