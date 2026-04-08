const API = import.meta.env.VITE_API_URL; // ✅ use env

function getToken() {
  return localStorage.getItem("token");
}

// ✅ COMMON REQUEST FUNCTION
async function request(path, { method = "GET", body } = {}) {
  const headers = {};
  const token = getToken();

  // ✅ Add token only if exists
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // ✅ Handle JSON vs FormData
  let finalBody = body;

  if (body && !(body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
    finalBody = JSON.stringify(body);
  }

  const res = await fetch(`${API}${path}`, {
    method,
    headers,
    body: finalBody,
  });

  let data = {};
  const text = await res.text();

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { message: text };
    }
  }

  if (!res.ok) {
    throw new Error(data.message || `API error (${res.status})`);
  }

  return data;
}

// ✅ EXPORT FUNCTIONS
export const apiGet = (path) => request(path);

export const apiPost = (path, body) =>
  request(path, { method: "POST", body });

export const apiPatch = (path, body) =>
  request(path, { method: "PATCH", body });

export const apiDelete = (path) =>
  request(path, { method: "DELETE" });



// export const apiPost = async (url, body) => {
//   try {
//     const res = await api.post(url, body);
//     return res.data;
//   } catch (err) {
//     console.log("POST ERROR:", err?.response?.data || err.message);
//     throw err;
//   }
// };

// export default api;

// const API = "http://localhost:8000";

// function getToken() {
//   return localStorage.getItem("token");
// }

// async function request(path, { method = "GET", body } = {}) {
//   const headers = {};
//   const token = getToken();
//   if (token) headers.Authorization = `Bearer ${token}`;

//   let finalBody = body;

//   // JSON body
//   if (body && !(body instanceof FormData)) {
//     headers["Content-Type"] = "application/json";
//     finalBody = JSON.stringify(body);
//   }

//   const res = await fetch(`${API}${path}`, {
//     method,
//     headers,
//     body: finalBody,
//   });

//   // handle empty response (204 etc.)
//   let data = {};
//   const text = await res.text();
//   if (text) {
//     try {
//       data = JSON.parse(text);
//     } catch {
//       data = { message: text };
//     }
//   }

//   if (!res.ok) {
//     throw new Error(data.message || `API error (${res.status})`);
//   }

//   return data;
// }

// export const apiGet = (path) => request(path);
// export const apiPost = (path, body) => request(path, { method: "POST", body });
// export const apiPatch = (path, body) => request(path, { method: "PATCH", body });
// export const apiDelete = (path) => request(path, { method: "DELETE" });