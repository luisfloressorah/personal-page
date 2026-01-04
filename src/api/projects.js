import apiClient from "./client";

export async function getAdminProjects() {
  const { data } = await apiClient.get("/projects?admin=true");
  return data; // array
}
