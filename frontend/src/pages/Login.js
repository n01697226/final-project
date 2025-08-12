import React, { useState } from "react";
import { apiPost } from "../api";

function Login(props) {
  var [email, setEmail] = useState("");
  var [password, setPassword] = useState("");
  var [message, setMessage] = useState("");

  async function submit(e) {
    e.preventDefault();
    setMessage("");
    var data = await apiPost("/auth/login", {
      email: email,
      password: password,
    });
    if (data && data.token) {
      props.onLoginSuccess(data.token, data.name);
    } else {
      setMessage(data && data.message ? data.message : "Login failed");
    }
  }

  return (
    <div className="card">
      <h2>Login</h2>
      <form onSubmit={submit}>
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
          <button type="submit">Login</button>
        </div>
        {message ? <p>{message}</p> : null}
      </form>
    </div>
  );
}

export default Login;
