import apiClient from "./client";

export async function listMessages() {
  const { data } = await apiClient.get("/messages");
  return data; // array
}

export async function createMessage(payload) {
  const { data } = await apiClient.post("/messages", payload); // público
  return data;
}

export async function updateMessageStatus(id, status) {
  const { data } = await apiClient.put(`/messages/${id}/status`, { status });
  return data;
}

export async function deleteMessage(id) {
  const { data } = await apiClient.delete(`/messages/${id}`);
  return data; // { message: "deleted" }
}
