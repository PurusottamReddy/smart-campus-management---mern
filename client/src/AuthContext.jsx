import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);   // user details
  const [token, setToken] = useState(localStorage.getItem("token"));

  // Fetch logged-in user on token change
  useEffect(() => {
    if (token) {
      fetch("http://localhost:5000/api/auth/me", {
        headers: { Authorization: "Bearer " + token },
      })
        .then(res => res.json())
        .then(data => {
          if (data && data._id) setUser(data);

          else setUser(null);
        })
        .catch(() => setUser(null));
    } else {
      setUser(null);
    }
  }, [token]);

  const login = (tok) => {
    localStorage.setItem("token", tok);
    setToken(tok);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
