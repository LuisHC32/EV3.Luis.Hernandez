export type Proyecto = {
  id: number;
  nombre: string;
  fecha_inicio: string;
  estado: string;
  responsable: string;
  monto: number;
  created_by: number;
};

export type ProyectoFormData = {
  nombre: string;
  fecha_inicio: string;
  estado: string;
  responsable: string;
  monto: string;
};

export const ESTADOS_PROYECTO = [
  "Planificado",
  "En progreso",
  "En revisión",
  "Completado",
  "Cancelado",
] as const;

export const emptyProyectoForm = (): ProyectoFormData => ({
  nombre: "",
  fecha_inicio: "",
  estado: "Planificado",
  responsable: "",
  monto: "",
});
