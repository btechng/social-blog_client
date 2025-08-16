import React from "react";
import { Routes, Route, Link, Navigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Feed from "./pages/Feed.jsx";
import PostDetail from "./pages/PostDetail.jsx";
import Profile from "./pages/Profile.jsx";
import Chat from "./pages/Chat.jsx";
import { useAuth } from "./context/AuthContext.jsx";

function Nav() {
  const { user, logout } = useAuth();
  return (
    <nav
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 24px",
        borderBottom: "1px solid #e5e7eb",
        background: "#ffffff",
        boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: 16,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <Link style={navLinkStyle} to="/">
          Feed
        </Link>
        {user && (
          <Link style={navLinkStyle} to={`/profile/${user._id}`}>
            My Profile
          </Link>
        )}
        {user && (
          <Link style={navLinkStyle} to="/chat">
            DMs
          </Link>
        )}
      </div>
      <div
        style={{
          display: "flex",
          gap: 12,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        {!user ? (
          <>
            <Link style={buttonLinkStyle} to="/login">
              Login
            </Link>
            <Link style={buttonLinkStyle} to="/register">
              Register
            </Link>
          </>
        ) : (
          <button
            onClick={logout}
            style={{
              ...buttonLinkStyle,
              cursor: "pointer",
              background: "#ef4444",
              color: "#fff",
              border: "none",
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = "#dc2626")}
            onMouseOut={(e) => (e.currentTarget.style.background = "#ef4444")}
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}

// Shared styles
const navLinkStyle = {
  textDecoration: "none",
  padding: "8px 12px",
  borderRadius: "6px",
  color: "#1f2937",
  fontWeight: 500,
  transition: "background 0.2s, color 0.2s",
  cursor: "pointer",
};

const buttonLinkStyle = {
  textDecoration: "none",
  padding: "8px 14px",
  borderRadius: "6px",
  background: "#2563eb",
  color: "#fff",
  fontWeight: 500,
  transition: "background 0.2s",
  cursor: "pointer",
};

function PrivateRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <div style={{ minHeight: "100vh", background: "#f9fafb" }}>
      <Nav />
      <div style={{ maxWidth: 900, margin: "0 auto", padding: 16 }}>
        <Routes>
          <Route path="/" element={<Feed />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/post/:id" element={<PostDetail />} />
          <Route
            path="/profile/:id"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route
            path="/chat"
            element={
              <PrivateRoute>
                <Chat />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </div>
  );
}
