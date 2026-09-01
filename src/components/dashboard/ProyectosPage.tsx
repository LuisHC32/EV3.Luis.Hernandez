"use client";

import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { ProyectosSection } from "@/components/dashboard/ProyectosSection";
import { DashboardLoading } from "@/components/dashboard/DashboardLoading";
import { SuccessModal } from "@/components/dashboard/SuccessModal";
import { useAuthProyectos } from "@/hooks/useAuthProyectos";
import { useCallback, useState } from "react";

type SuccessNotice = {
  title: string;
  message: string;
};

export function ProyectosPage() {
  const { user, proyectos, loading, error, loadProyectos } = useAuthProyectos();
  const [successNotice, setSuccessNotice] = useState<SuccessNotice | null>(
    null,
  );

  const handleSuccess = useCallback((title: string, message: string) => {
    setSuccessNotice({ title, message });
  }, []);

  const closeSuccess = useCallback(() => {
    setSuccessNotice(null);
  }, []);

  if (loading) {
    return <DashboardLoading label="Cargando proyectos..." />;
  }

  if (!user) {
    return null;
  }

  return (
    <>
      <DashboardShell user={user}>
        <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-xl">
          {error ? (
            <div className="rounded-lg border border-error-container bg-error-container px-md py-sm">
              <p className="font-body-md text-body-md text-on-error-container">
                {error}
              </p>
            </div>
          ) : null}

          <ProyectosSection
            proyectos={proyectos}
            currentUserId={user.id}
            onRefresh={loadProyectos}
            onSuccess={handleSuccess}
          />
        </div>
      </DashboardShell>

      <SuccessModal
        open={Boolean(successNotice)}
        title={successNotice?.title ?? ""}
        message={successNotice?.message ?? ""}
        onClose={closeSuccess}
      />
    </>
  );
}
