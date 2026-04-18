import {
  MedicionCreate,
  MedicionRead,
  ListMedicionesParams,
  MeasurementsByPlotResponse,
} from "../types/measurement";
import { apiRequest } from "./apiClient";

const buildEndpoint = (path: string, query: URLSearchParams) => {
  const queryString = query.toString();
  return queryString ? `${path}?${queryString}` : path;
};

type MeasurementsByPlotParams = Omit<
  ListMedicionesParams,
  "parcela_id" | "sensor_id" | "desde" | "hasta" | "skip"
> & {
  desde?: string | null;
  hasta?: string | null;
  skip?: number;
};

export const getMeasurementsByPlot = async (
  plotId: number,
  params: MeasurementsByPlotParams = {}
): Promise<MeasurementsByPlotResponse> => {
  const query = new URLSearchParams();
  const offset = params.offset ?? params.skip;
  const fechaInicio = params.fecha_inicio ?? params.desde;
  const fechaFin = params.fecha_fin ?? params.hasta;

  if (params.limit !== undefined) query.set("limit", String(params.limit));
  if (offset !== undefined) query.set("offset", String(offset));
  if (params.page !== undefined && params.page !== null) query.set("page", String(params.page));
  if (fechaInicio) query.set("fecha_inicio", fechaInicio);
  if (fechaFin) query.set("fecha_fin", fechaFin);

  return apiRequest(buildEndpoint(`/parcelas/${plotId}/mediciones`, query));
};

export const getMediciones = async (params: ListMedicionesParams = {}): Promise<MedicionRead[]> => {
  if (params.parcela_id !== undefined && params.parcela_id !== null) {
    const response = await getMeasurementsByPlot(params.parcela_id, params);

    return response.items;
  }

  const query = new URLSearchParams();
  const desde = params.desde ?? params.fecha_inicio;
  const hasta = params.hasta ?? params.fecha_fin;
  const skip = params.skip ?? params.offset;

  if (params.sensor_id !== undefined && params.sensor_id !== null) query.set("sensor_id", String(params.sensor_id));
  if (desde) query.set("desde", desde);
  if (hasta) query.set("hasta", hasta);
  if (skip !== undefined) query.set("skip", String(skip));
  if (params.limit !== undefined) query.set("limit", String(params.limit));

  return apiRequest(buildEndpoint(`/mediciones/`, query));
};

export const getMedicionById = async (medicion_id: number): Promise<MedicionRead> => {
  return apiRequest(`/mediciones/${medicion_id}`);
};

export const createMedicion = async (data: MedicionCreate): Promise<MedicionRead> => {
  return apiRequest("/mediciones/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
};
