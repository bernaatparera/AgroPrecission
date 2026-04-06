const API_URL = "http://localhost:8000/api/v1";

export const apiRequest = async (
  endpoint: string,
  options: RequestInit = {}
) => {

  // coger token automáticamente
  const token = localStorage.getItem("token");

  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string> || {}),
  };

  // añadir auth si hay token
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  let data;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    if (res.status === 422 && Array.isArray(data?.detail)) {
      const message = data.detail
        .map((err: any) => `${err.loc?.[1] ?? "campo"}: ${err.msg}`)
        .join(", ");
      throw new Error(message);
    }

    throw new Error(data?.detail || "Error en la petición");
  }

  return data;
};