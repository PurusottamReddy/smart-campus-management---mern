import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, AuthContext } from "./AuthContext.jsx";

import Login from "/pages/Login.jsx";
import Register from "/pages/Register.jsx";
import StudentDashboard from "/pages/StudentDashboard.jsx";
import FacultyDashboard from "/pages/FacultyDashboard.jsx";
import AdminDashboard from "/pages/AdminDashboard.jsx";

function PrivateRoute({ children, role }) {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div className="container"><div className="card">Checking session…</div></div>;
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;
  return children;
}

function RoleBasedDashboard() {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div className="container"><div className="card">Checking session…</div></div>;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === "student") return <StudentDashboard />;
  if (user.role === "faculty") return <FacultyDashboard />;
  if (user.role === "admin") return <AdminDashboard />;
  return <div className="container"><div className="card">Unknown role</div></div>;
}

function HeaderBar() {
  const { user, logout } = useContext(AuthContext);
  if (!user) return null;
  return (
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "10px 16px", borderBottom: "1px solid #1f2937", background: "rgba(2,6,23,0.5)"
    }}>
      <div style={{ fontWeight: 700 }}>Smart Campus</div>
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <span style={{ color: "#94a3b8" }}>{user.name} ({user.role})</span>
        <button className="btn ghost" onClick={logout}>Logout</button>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <HeaderBar />
        <Routes>
          <Route path="/" element={<RoleBasedDashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Example: Protect routes by role */}
          <Route
            path="/student"
            element={
              <PrivateRoute role="student">
                <StudentDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/faculty"
            element={
              <PrivateRoute role="faculty">
                <FacultyDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <PrivateRoute role="admin">
                <AdminDashboard />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
