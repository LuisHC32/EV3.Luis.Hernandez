export function normalizeEstado(estado: string) {
  if (/^En revisi/i.test(estado) && estado !== "En revisión") {
    return "En revisión";
  }

  return estado;
}

export function formatEstadoLabel(estado: string) {
  return normalizeEstado(estado);
}

export function estadoBadgeClass(estado: string) {
  switch (normalizeEstado(estado)) {
    case "Completado":
      return "bg-[#F0FDF4] text-[#15803D]";
    case "En progreso":
      return "bg-[#EFF6FF] text-[#1D4ED8]";
    case "Cancelado":
    case "Retrasado":
      return "bg-[#FEF2F2] text-[#B91C1C]";
    case "En revisión":
      return "bg-[#FEF3C7] text-[#92400E]";
    case "Planificado":
      return "bg-[#F1F5F9] text-[#475569]";
    default:
      return "bg-[#F1F5F9] text-[#475569]";
  }
}
