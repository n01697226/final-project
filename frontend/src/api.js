const API_BASE = "http://localhost:5000/api";

function getToken() {
  try {
    const token = localStorage.getItem("token");
    return token || "";
  } catch (e) {
    return "";
  }
}

export function setToken(token) {
  try {
    localStorage.setItem("token", token);
  } catch (e) {}
}

export function clearToken() {
  try {
    localStorage.removeItem("token");
  } catch (e) {}
}

export async function apiGet(path) {
  const res = await fetch(API_BASE + path, {
    headers: { Authorization: "Bearer " + getToken() },
  });
  return res.json();
}

export async function apiPost(path, body) {
  const res = await fetch(API_BASE + path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + getToken(),
    },
    body: JSON.stringify(body),
  });
  return res.json();
}

export async function apiPut(path, body) {
  const res = await fetch(API_BASE + path, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + getToken(),
    },
    body: JSON.stringify(body),
  });
  return res.json();
}

export async function apiDelete(path) {
  const res = await fetch(API_BASE + path, {
    method: "DELETE",
    headers: { Authorization: "Bearer " + getToken() },
  });
  return res.json();
}
