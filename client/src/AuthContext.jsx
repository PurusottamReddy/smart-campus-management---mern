import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  });
  const [loading, setLoading] = useState(!!token);

  useEffect(() => {
    let aborted = false;
    if (!token) {
      setUser(null);
      localStorage.removeItem("user");
      setLoading(false);
      return;
    }

    setLoading(true);
    fetch("http://localhost:5000/api/auth/me", {
      headers: { Authorization: "Bearer " + token },
    })
      .then(async (res) => {
        if (!res.ok) {
          if (res.status === 401) {
            if (!aborted) {
              setUser(null);
              localStorage.removeItem("user");
            }
          }
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (aborted) return;
        if (data && data._id) {
          setUser(data);
          localStorage.setItem("user", JSON.stringify(data));
        } else {
          setUser(null);
          localStorage.removeItem("user");
        }
      })
      .catch(() => {
        // transient error: keep existing user; avoid forced logout
      })
      .finally(() => {
        if (!aborted) setLoading(false);
      });

    return () => { aborted = true; };
  }, [token]);

  const login = (tok) => {
    localStorage.setItem("token", tok);
    setToken(tok);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
