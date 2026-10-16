const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api"
).replace(/\/+$/, "");

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...options.headers,
    },
  });

  const result = await response.json().catch(() => ({}));

  if (!response.ok || result.success === false) {
    throw new Error(result.message || `Request failed (${response.status})`);
  }

  return result;
}

const jsonBody = (data) => JSON.stringify(data);

export const api = {
  getProjects() {
    return request("/projects");
  },

  createProject(data) {
    return request("/projects", {
      method: "POST",
      body: jsonBody(data),
    });
  },

  updateProject(id, data) {
    return request(`/projects/${encodeURIComponent(id)}`, {
      method: "PUT",
      body: jsonBody(data),
    });
  },

  deleteProject(id) {
    return request(`/projects/${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
  },

  getEstimations(projectId) {
    return request(`/projects/${encodeURIComponent(projectId)}/estimations`);
  },

  createEstimation(projectId, data) {
    return request(`/projects/${encodeURIComponent(projectId)}/estimations`, {
      method: "POST",
      body: jsonBody(data),
    });
  },

  deleteEstimation(id) {
    return request(`/estimations/${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
  },
};
