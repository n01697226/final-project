import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar(props) {
  var navigate = useNavigate();

  function goHome(e) {
    e.preventDefault();
    navigate("/");
  }

  return (
    <div className="navbar">
      <a href="/" onClick={goHome} className="brand">AutoTrack</a>
      <div className="navlinks">
        <Link to="/">Home</Link>
        <Link to="/vehicles">Vehicles</Link>
        <Link to="/expenses">Expenses</Link>
        <Link to="/overview">Overview</Link>
        {props.name ? (
          <a href="#logout" onClick={function(e){ e.preventDefault(); props.onLogout(); }}>
            Logout ({props.name})
          </a>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </div>
  );
}

export default Navbar;
