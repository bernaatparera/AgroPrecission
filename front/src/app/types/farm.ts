export interface Farm {
  id: number;
  nombre: string;
  ubicacion_geo: string | null;
  creado_en: string;
}

// request para crear
export interface CreateFarmRequest {
  nombre: string;
  ubicacion_geo?: string | null;
}