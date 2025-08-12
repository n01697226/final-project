import React, { useState } from "react";
import { Link } from "react-router-dom";
import { apiPost } from "../api";

function Register() {
  var [name, setName] = useState("");
  var [email, setEmail] = useState("");
  var [password, setPassword] = useState("");
  var [message, setMessage] = useState("");

  async function submit(e) {
    e.preventDefault();
    setMessage("");
    var data = await apiPost("/auth/register", {
      name: name,
      email: email,
      password: password,
    });
    if (data && data.userId) {
      setMessage("Registered. You can login now.");
    } else {
      setMessage(data && data.message ? data.message : "Registration failed");
    }
  }

  return (
    <div className="card">
      <h2>Register</h2>

      <form onSubmit={submit}>
        <label>Name</label>
        <input
          value={name}
          onChange={function (e) {
            setName(e.target.value);
          }}
        />

        <label>Email</label>
        <input
          value={email}
          onChange={function (e) {
            setEmail(e.target.value);
          }}
        />

        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={function (e) {
            setPassword(e.target.value);
          }}
        />

        <div style={{ marginTop: 12 }}>
          <button type="submit">Register</button>
        </div>
        {message ? <p className="error-message">{message}</p> : null}
      </form>

      <p>
        Already have an account with us? <Link to="/login">Login here</Link>
      </p>
    </div>
  );
}

export default Register;
