import { SensorCreate, SensorRead, ListSensoresParams } from "../types/sensor";
import { apiRequest } from "./apiClient";

export const getSensores = async (params: ListSensoresParams = {}): Promise<SensorRead[]> => {
  const query = new URLSearchParams();
  if (params.casilla_id !== undefined && params.casilla_id !== null) query.set("casilla_id", String(params.casilla_id));
  if (params.skip !== undefined) query.set("skip", String(params.skip));
  if (params.limit !== undefined) query.set("limit", String(params.limit));

  return apiRequest(`/sensores/?${query.toString()}`);
};

export const getSensorById = async (sensor_id: number): Promise<SensorRead> => {
  return apiRequest(`/sensores/${sensor_id}`);
};

export const createSensor = async (data: SensorCreate): Promise<SensorRead> => {
  return apiRequest("/sensores/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
};

export const deleteSensor = async (sensor_id: number): Promise<void> => {
  return apiRequest(`/sensores/${sensor_id}`, { method: "DELETE" });
};

export const createOrGetSensor = async (data: SensorCreate): Promise<SensorRead> => {
  try {
    return await createSensor(data);
  } catch {
    const allSensors = await apiRequest(`/sensores/?limit=500`);
    const existing = allSensors.find((s: SensorRead) => s.numref === data.numref);
    if (existing) {
      if (existing.casilla_id !== data.casilla_id) {
        return await apiRequest(`/sensores/${existing.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ casilla_id: data.casilla_id }),
        });
      }
      return existing;
    }
    throw new Error("No se pudo crear el sensor");
  }
};