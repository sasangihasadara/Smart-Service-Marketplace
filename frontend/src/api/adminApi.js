const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? "http://localhost:8080/api" : "/api");

export async function fetchAdminResource(path) {
  const response = await fetch(`${API_BASE_URL}/admin${path}`);

  if (!response.ok) {
    throw new Error(`Admin API request failed: ${response.status}`);
  }

  return response.json();
}
