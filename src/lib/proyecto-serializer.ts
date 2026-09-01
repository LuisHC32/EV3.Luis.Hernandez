import type { Proyecto as PrismaProyecto } from "@prisma/client";

export type ProyectoResponse = {
  id: number;
  nombre: string;
  fecha_inicio: string;
  estado: string;
  responsable: string;
  monto: number;
  created_by: number;
};

export function serializeProyecto(proyecto: PrismaProyecto): ProyectoResponse {
  return {
    id: proyecto.id,
    nombre: proyecto.nombre,
    fecha_inicio: proyecto.fecha_inicio.toISOString().slice(0, 10),
    estado: proyecto.estado,
    responsable: proyecto.responsable,
    monto: proyecto.monto,
    created_by: proyecto.created_by,
  };
}
