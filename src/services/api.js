// // const API = "http://localhost:8000"; 
// const API = "https://dlf-backend-hoi7.onrender.com";
// function getToken() {
//   return localStorage.getItem("token");
// }

// export async function apiGet(path) {
//   const token = localStorage.getItem("token");

//   const res = await fetch(`${API}${path}`, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });

//   const data = await res.json().catch(() => ({}));
//   if (!res.ok) throw new Error(data.message || "API error");
//   return data;
// }

// export async function apiPost(path, body) {
//   const res = await fetch(`${API}${path}`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${getToken()}`,
//     },
//     body: JSON.stringify(body),
//   });
//   const data = await res.json().catch(() => ({}));
//   if (!res.ok) throw new Error(data.message || "API error");
//   return data;
// }

// export async function apiPatch(path, body) {
//   const res = await fetch(`${API}${path}`, {
//     method: "PATCH",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${getToken()}`,
//     },
//     body: JSON.stringify(body),
//   });
//   const data = await res.json().catch(() => ({}));
//   if (!res.ok) throw new Error(data.message || "API error");
//   return data;
// }

// import axios from "axios";

// const api = axios.create({
//   baseURL: "http://localhost:8000",
// });

// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

// // export const apiPost = async (url, body) => {
// //   try {
// //     const res = await api.post(url, body);
// //     return res.data;
// //   } catch (err) {
// //     console.log("POST ERROR:", err?.response?.data || err.message);
// //     throw err;
// //   }
// // };

// export default api;

// // const API = "http://localhost:8000";

// // function getToken() {
// //   return localStorage.getItem("token");
// // }

// // async function request(path, { method = "GET", body } = {}) {
// //   const headers = {};
// //   const token = getToken();
// //   if (token) headers.Authorization = `Bearer ${token}`;

// //   let finalBody = body;

// //   // JSON body
// //   if (body && !(body instanceof FormData)) {
// //     headers["Content-Type"] = "application/json";
// //     finalBody = JSON.stringify(body);
// //   }

// //   const res = await fetch(`${API}${path}`, {
// //     method,
// //     headers,
// //     body: finalBody,
// //   });

// //   // handle empty response (204 etc.)
// //   let data = {};
// //   const text = await res.text();
// //   if (text) {
// //     try {
// //       data = JSON.parse(text);
// //     } catch {
// //       data = { message: text };
// //     }
// //   }

// //   if (!res.ok) {
// //     throw new Error(data.message || `API error (${res.status})`);
// //   }

// //   return data;
// // }

// // export const apiGet = (path) => request(path);
// // export const apiPost = (path, body) => request(path, { method: "POST", body });
// // export const apiPatch = (path, body) => request(path, { method: "PATCH", body });
// // export const apiDelete = (path) => request(path, { method: "DELETE" });

const API = import.meta.env.VITE_API_URL || "http://localhost:8000";

function getToken() {
  return localStorage.getItem("token");
}

async function request(path, { method = "GET", body } = {}) {
  const headers = {};
  const token = getToken();

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  let finalBody = body;

  if (body && !(body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
    finalBody = JSON.stringify(body);
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const res = await fetch(`${API}${path}`, {
      method,
      headers,
      body: finalBody,
      signal: controller.signal,
      credentials: "include",
    });

    const text = await res.text();
    let data = {};

    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        data = { message: text };
      }
    }

    if (!res.ok) {
      const error = new Error(data.message || `API error (${res.status})`);
      error.status = res.status;
      throw error;
    }

    return data;

  } catch (err) {
    if (err.name === "AbortError") {
      throw new Error("Request timeout ❌ Server too slow");
    }
    throw err;
  } finally {
    clearTimeout(timeout);
  }
}

export const apiGet = (path) => request(path);
export const apiPost = (path, body) => request(path, { method: "POST", body });
export const apiPatch = (path, body) => request(path, { method: "PATCH", body });
export const apiDelete = (path) => request(path, { method: "DELETE" });