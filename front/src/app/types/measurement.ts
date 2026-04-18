
export interface MedicionCreate {
  sensor_id: number;
  variable: string;       // min 1, max 50
  valor: number;
  dia_hora?: string | null; // ISO date-time, opcional (el back pone now() si no se envía)
}

export interface MedicionRead {
  id: number;
  sensor_id: number;
  casilla_id: number;
  variable: string;
  valor: number;
  dia_hora: string; // ISO date-time
}

export interface MeasurementsByPlotResponse {
  total: number;
  limit: number;
  offset: number;
  page: number;
  items: MedicionRead[];
}

export interface ListMedicionesParams {
  parcela_id?: number | null;
  sensor_id?: number | null;
  fecha_inicio?: string | null; // ISO date-time
  fecha_fin?: string | null;    // ISO date-time
  offset?: number;              // default 0
  page?: number | null;         // default 1
  desde?: string | null;  // ISO date-time
  hasta?: string | null;  // ISO date-time
  skip?: number;          // default 0
  limit?: number;         // default 100, max 2000
}
