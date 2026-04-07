import { Farm, CreateFarmRequest } from "../types/farm";
import { apiRequest } from "./apiClient";

// GET listado
export const getFarms = async (): Promise<Farm[]> => {
  return apiRequest("/granjas");
};

// POST crear
export const createFarm = async (data: CreateFarmRequest): Promise<Farm> => {
  return apiRequest("/granjas", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
};