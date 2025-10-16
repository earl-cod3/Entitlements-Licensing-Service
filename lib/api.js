// lib/api.js
const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
const isBrowser = typeof window !== "undefined";

const authHeader = () => {
  if (!isBrowser) return {};
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

async function fetchWithTimeout(url, options = {}, timeoutMs = 15000) {
  const ctrl = new AbortController();
  const id = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...options, signal: ctrl.signal });
    const text = await res.text(); // read once
    if (!res.ok) {
      // try parse JSON error, otherwise return text
      let detail = text;
      try { detail = JSON.parse(text); } catch (_) {}
      const err = new Error(typeof detail === "string" ? detail : detail?.message || "Request failed");
      err.status = res.status;
      err.detail = detail;
      throw err;
    }
    return text ? JSON.parse(text) : null;
  } finally {
    clearTimeout(id);
  }
}

export async function getJSON(path) {
  return fetchWithTimeout(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...authHeader() },
    cache: "no-store",
  });
}

export async function postJSON(path, body, extraHeaders = {}) {
  return fetchWithTimeout(`${BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeader(), ...extraHeaders },
    body: JSON.stringify(body ?? {}),
  });
}

// Handy helpers you’ll likely use soon:
export async function patchJSON(path, body) {
  return fetchWithTimeout(`${BASE}${path}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...authHeader() },
    body: JSON.stringify(body ?? {}),
  });
}
export async function del(path) {
  return fetchWithTimeout(`${BASE}${path}`, {
    method: "DELETE",
    headers: { ...authHeader() },
  });
}
