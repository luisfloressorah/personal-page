import apiClient from "./client";

export async function listExperience() {
  const { data } = await apiClient.get("/experience");
  return data; // array
}

export async function createExperience(payload) {
  const { data } = await apiClient.post("/experience", payload);
  return data;
}

export async function updateExperience(id, payload) {
  const { data } = await apiClient.put(`/experience/${id}`, payload);
  return data;
}

export async function deleteExperience(id) {
  const { data } = await apiClient.delete(`/experience/${id}`);
  return data; // { message: "deleted" }
}
