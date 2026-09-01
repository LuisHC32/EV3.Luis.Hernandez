import { Proyecto } from "@/types/proyecto";

type DashboardStatsProps = {
  proyectos: Proyecto[];
};

function countByEstado(proyectos: Proyecto[], estado: string) {
  return proyectos.filter(
    (p) => p.estado.toLowerCase() === estado.toLowerCase(),
  ).length;
}

function formatMonto(value: number) {
  if (value === 0) return "$0";
  return `$${value.toLocaleString("es-CL")}`;
}

export function DashboardStats({ proyectos }: DashboardStatsProps) {
  const total = proyectos.length;
  const montoTotal = proyectos.reduce((sum, p) => sum + Number(p.monto), 0);
  const enProgreso = countByEstado(proyectos, "en progreso");
  const completados = countByEstado(proyectos, "completado");

  return (
    <div className="mb-[48px] grid grid-cols-1 gap-md sm:grid-cols-2 lg:grid-cols-4">
      <div className="card-shadow flex flex-col rounded-lg border border-outline-variant bg-surface-container-lowest p-lg">
        <div className="mb-md flex items-start justify-between">
          <div className="rounded-md bg-primary-fixed p-sm text-on-primary-fixed">
            <span className="material-symbols-outlined">folder_open</span>
          </div>
        </div>
        <p className="font-label-md text-label-md mb-xs text-on-surface-variant">
          Total proyectos
        </p>
        <p className="font-headline-md text-headline-md text-on-background">
          {total}
        </p>
      </div>

      <div className="card-shadow flex flex-col rounded-lg border border-outline-variant bg-surface-container-lowest p-lg">
        <div className="mb-md flex items-start justify-between">
          <div className="rounded-md bg-secondary-fixed p-sm text-on-secondary-fixed">
            <span className="material-symbols-outlined">payments</span>
          </div>
        </div>
        <p className="font-label-md text-label-md mb-xs text-on-surface-variant">
          Monto total
        </p>
        <p className="font-headline-md text-headline-md text-on-background">
          {formatMonto(montoTotal)}
        </p>
      </div>

      <div className="card-shadow flex flex-col rounded-lg border border-outline-variant bg-surface-container-lowest p-lg">
        <div className="mb-md flex items-start justify-between">
          <div className="rounded-md bg-tertiary-fixed p-sm text-on-tertiary-fixed">
            <span className="material-symbols-outlined">pending_actions</span>
          </div>
        </div>
        <p className="font-label-md text-label-md mb-xs text-on-surface-variant">
          En progreso
        </p>
        <p className="font-headline-md text-headline-md text-on-background">
          {enProgreso}
        </p>
      </div>

      <div className="card-shadow flex flex-col rounded-lg border border-outline-variant bg-surface-container-lowest p-lg">
        <div className="mb-md flex items-start justify-between">
          <div className="rounded-md bg-[#DCFCE7] p-sm text-[#166534]">
            <span className="material-symbols-outlined">task_alt</span>
          </div>
        </div>
        <p className="font-label-md text-label-md mb-xs text-on-surface-variant">
          Completados
        </p>
        <p className="font-headline-md text-headline-md text-on-background">
          {completados}
        </p>
      </div>
    </div>
  );
}
