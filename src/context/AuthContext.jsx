import React, { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode"; // ✅ fixed import

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const d = jwtDecode(token);
        setUser({ _id: d._id, username: d.username });
      } catch {
        // if token is invalid, clear it
        localStorage.removeItem("token");
      }
    }
  }, []);

  const login = (token, user) => {
    localStorage.setItem("token", token);
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
