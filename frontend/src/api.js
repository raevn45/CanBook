const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "/api").replace(/\/$/, "");

const api = async (endpoint, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const contentType = response.headers.get("content-type") || "";
  let data;

  if (contentType.includes("application/json")) {
    data = await response.json();
  } else {
    const text = await response.text();
    const cleanText = text.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
    throw new Error(
      response.status === 404
        ? `CanBook API route not found: ${endpoint}. Check the Flask backend URL and make sure it is running.`
        : `CanBook API returned ${response.status} instead of JSON${cleanText ? `: ${cleanText.slice(0, 140)}` : "."}`
    );
  }

  if (!response.ok) {
    throw new Error(data?.error || "Something went wrong.");
  }

  return data;
};

export const authapi = {
  login: (data) => api("/auth/login", { method: "POST", body: JSON.stringify(data) }),
  register: (data) => api("/auth/register", { method: "POST", body: JSON.stringify(data) }),
  logout: () => api("/auth/logout", { method: "POST" }),
  me: () => api("/auth/me"),
};

export const menuapi = {
  get: () => api("/menu"),
};

export const orderapi = {
  getall: () => api("/orders"),
  getone: (id) => api(`/orders/${id}`),
  create: (data) => api("/orders", { method: "POST", body: JSON.stringify(data) }),
};

export const canteenapi = {
  dashboard: () => api("/canteen/dashboard"),
  analytics: () => api("/canteen/analytics"),
  updateorder: (id, status) => api(`/canteen/orders/${id}`, { method: "PATCH", body: JSON.stringify({ status }) }),
  menu: () => api("/canteen/menu"),
  additem: (data) => api("/canteen/menu", { method: "POST", body: JSON.stringify(data) }),
  toggleitem: (id, available) => api(`/canteen/menu/${id}`, { method: "PATCH", body: JSON.stringify({ available }) }),
};
