import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Vehicles from "./pages/Vehicles";
import Expenses from "./pages/Expenses";
import Overview from "./pages/Overview";
import { setToken, clearToken } from "./api";
import "./App.css";

function App() {
  var navigate = useNavigate();
  var initialName = localStorage.getItem("name") || "";
  var initialToken = localStorage.getItem("token") || "";

  var [name, setName] = useState(initialName);
  var [token, setTokenState] = useState(initialToken);

  function handleLogout() {
    clearToken();
    localStorage.removeItem("name");
    setTokenState("");
    setName("");
    navigate("/login");
  }

  function onLoginSuccess(nextToken, nextName) {
    setToken(nextToken);
    localStorage.setItem("name", nextName);
    setTokenState(nextToken);
    setName(nextName);
    navigate("/");
  }

  function ProtectedRoute(props) {
    if (!token) {
      return <Navigate to="/login" />;
    }
    return props.children;
  }

  useEffect(
    function () {
      var saved = localStorage.getItem("token") || "";
      if (saved && !token) {
        setTokenState(saved);
        setName(localStorage.getItem("name") || "");
      }
    },
    [token]
  );

  return (
    <div className="app-wrap">
      <Navbar name={name} onLogout={handleLogout} />
      <div className="container">
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/login"
            element={<Login onLoginSuccess={onLoginSuccess} />}
          />
          <Route path="/register" element={<Register />} />
          <Route
            path="/vehicles"
            element={
              <ProtectedRoute>
                <Vehicles />
              </ProtectedRoute>
            }
          />
          <Route
            path="/expenses"
            element={
              <ProtectedRoute>
                <Expenses />
              </ProtectedRoute>
            }
          />
          <Route
            path="/overview"
            element={
              <ProtectedRoute>
                <Overview />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
