import apiClient from "./client";

let csrfReady = false;

export async function ensureCsrf() {
  if (csrfReady) return;
  await apiClient.get("/auth/csrf");
  csrfReady = true;
}

export function resetCsrf() {
  csrfReady = false;
}
