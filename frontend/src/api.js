const api = async (endpoint, options = {}) => {
  const response = await fetch(`/api${endpoint}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Something went wrong.");
  }

  return data;
};

export const authapi = {
  login: (data) =>
    api("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  register: (data) =>
    api("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  logout: () =>
    api("/auth/logout", {
      method: "POST",
    }),

  me: () => api("/auth/me"),
};

export const menuapi = {
  get: () => api("/menu"),
};

export const orderapi = {
  getall: () => api("/orders"),

  getone: (id) => api(`/orders/${id}`),

  create: (data) =>
    api("/orders", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

export const canteenapi = {
  dashboard: () => api("/canteen/dashboard"),

  updateorder: (id, status) =>
    api(`/canteen/orders/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),

  menu: () => api("/canteen/menu"),

  additem: (data) =>
    api("/canteen/menu", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  toggleitem: (id, available) =>
    api(`/canteen/menu/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ available }),
    }),
};
