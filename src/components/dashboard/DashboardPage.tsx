"use client";

import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { DashboardLoading } from "@/components/dashboard/DashboardLoading";
import { useAuthProyectos } from "@/hooks/useAuthProyectos";
import { displayUserName } from "@/lib/display-user";

export function DashboardPage() {
  const { user, proyectos, loading, error } = useAuthProyectos();

  if (loading) {
    return <DashboardLoading label="Cargando panel..." />;
  }

  if (!user) {
    return null;
  }

  const firstName = displayUserName(user);

  return (
    <DashboardShell user={user}>
      <div className="mx-auto max-w-[1440px]">
        <div className="mb-xl">
          <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg mb-xs text-on-background">
            Bienvenido, {firstName}
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Resumen general y administración de tus proyectos.
          </p>
        </div>

        {error ? (
          <div className="mb-md rounded-lg border border-error-container bg-error-container px-md py-sm">
            <p className="font-body-md text-body-md text-on-error-container">
              {error}
            </p>
          </div>
        ) : null}

        <DashboardStats proyectos={proyectos} />
      </div>
    </DashboardShell>
  );
}
