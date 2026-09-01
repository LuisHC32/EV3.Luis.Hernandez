"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AuthMessage } from "@/components/AuthMessage";
import { ProyectoFormModal } from "@/components/dashboard/ProyectoFormModal";
import { ConfirmDeleteModal } from "@/components/dashboard/ConfirmDeleteModal";
import { authFetch } from "@/lib/auth-client";
import {
  estadoBadgeClass,
  formatEstadoLabel,
} from "@/lib/proyecto-estado";
import {
  Proyecto,
  ProyectoFormData,
  emptyProyectoForm,
} from "@/types/proyecto";

type ProyectosSectionProps = {
  proyectos: Proyecto[];
  currentUserId: number;
  onRefresh: () => Promise<void>;
  onSuccess: (title: string, message: string) => void;
};

const PAGE_SIZE = 8;

function formatCurrency(value: string | number) {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(Number(value));
}

function formatDate(value: string) {
  const formatted = new Intl.DateTimeFormat("es-CL", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));

  return formatted.replace(/\./g, "");
}

function toFormData(proyecto: Proyecto): ProyectoFormData {
  return {
    nombre: proyecto.nombre,
    fecha_inicio: proyecto.fecha_inicio.slice(0, 10),
    estado: proyecto.estado,
    responsable: proyecto.responsable,
    monto: String(proyecto.monto),
  };
}

export function ProyectosSection({
  proyectos,
  currentUserId,
  onRefresh,
  onSuccess,
}: ProyectosSectionProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProyecto, setEditingProyecto] = useState<Proyecto | null>(null);
  const [deletingProyecto, setDeletingProyecto] = useState<Proyecto | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [messageType, setMessageType] = useState<"success" | "error" | null>(
    null,
  );
  const [message, setMessage] = useState("");
  const [page, setPage] = useState(0);

  const totalProyectos = proyectos.length;
  const totalPages = Math.max(1, Math.ceil(totalProyectos / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages - 1);

  const paginatedProyectos = useMemo(() => {
    const start = currentPage * PAGE_SIZE;
    return proyectos.slice(start, start + PAGE_SIZE);
  }, [proyectos, currentPage]);

  const rangeStart = totalProyectos === 0 ? 0 : currentPage * PAGE_SIZE + 1;
  const rangeEnd = Math.min((currentPage + 1) * PAGE_SIZE, totalProyectos);

  useEffect(() => {
    setPage(0);
  }, [totalProyectos]);

  useEffect(() => {
    if (page > totalPages - 1) {
      setPage(Math.max(0, totalPages - 1));
    }
  }, [page, totalPages]);

  const showMessage = useCallback((type: "success" | "error", text: string) => {
    setMessageType(type);
    setMessage(text);
  }, []);

  async function handleCreate(data: ProyectoFormData) {
    setLoading(true);
    try {
      const response = await authFetch("/api/proyectos", {
        method: "POST",
        body: JSON.stringify({ ...data, monto: Math.round(Number(data.monto)) }),
      });
      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        showMessage("error", payload.error ?? "No se pudo crear el proyecto");
        return;
      }

      setModalOpen(false);
      onSuccess(
        "Proyecto creado",
        `El proyecto "${data.nombre}" se registró correctamente.`,
      );
      void onRefresh();
    } catch {
      showMessage("error", "Error de red al crear el proyecto");
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdate(data: ProyectoFormData) {
    if (!editingProyecto) return;

    setLoading(true);
    try {
      const response = await authFetch(`/api/proyectos/${editingProyecto.id}`, {
        method: "PUT",
        body: JSON.stringify({ ...data, monto: Math.round(Number(data.monto)) }),
      });
      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        showMessage(
          "error",
          payload.error ?? "No se pudo actualizar el proyecto",
        );
        return;
      }

      const nombre = data.nombre;
      setEditingProyecto(null);
      onSuccess(
        "Edición exitosa",
        `El proyecto "${nombre}" se actualizó correctamente.`,
      );
      void onRefresh();
    } catch {
      showMessage("error", "Error de red al actualizar el proyecto");
    } finally {
      setLoading(false);
    }
  }

  async function confirmDelete() {
    if (!deletingProyecto) return;

    setDeleteLoading(true);
    try {
      const response = await authFetch(`/api/proyectos/${deletingProyecto.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        let errorMessage = "No se pudo eliminar el proyecto";
        try {
          const payload = (await response.json()) as { error?: string };
          errorMessage = payload.error ?? errorMessage;
        } catch {
          // respuesta de error sin cuerpo JSON
        }
        showMessage("error", errorMessage);
        return;
      }

      const nombre = deletingProyecto.nombre;
      setDeletingProyecto(null);
      onSuccess(
        "Borrado exitoso",
        `El proyecto "${nombre}" se eliminó correctamente.`,
      );
      void onRefresh();
    } catch {
      showMessage("error", "Error de red al eliminar el proyecto");
    } finally {
      setDeleteLoading(false);
    }
  }

  return (
    <>
      {/* Header Section — proyectos.php líneas 150-160 */}
      <header className="flex w-full flex-col justify-between gap-md border-b border-outline-variant pb-md sm:flex-row sm:items-end">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-primary mb-xs">
            Proyectos
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant">
            Crea, edita y elimina los proyectos de la organización.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="flex items-center justify-center gap-xs self-start rounded-lg border-t border-[rgba(255,255,255,0.2)] bg-[#2563EB] px-md py-sm font-label-md text-label-md text-on-primary shadow-sm transition-opacity hover:opacity-90 sm:self-auto"
        >
          <span
            className="material-symbols-outlined"
            style={{ fontSize: 18 }}
          >
            add
          </span>
          + Nuevo proyecto
        </button>
      </header>

      {messageType === "error" && message ? (
        <AuthMessage type={messageType} text={message} />
      ) : null}

      {/* Projects Table Card — proyectos.php líneas 161-253 */}
      {proyectos.length === 0 ? (
        <div className="card-shadow flex flex-col items-center justify-center overflow-hidden rounded-lg border border-outline-variant bg-surface-container-lowest p-2xl text-center">
          <div className="mb-md flex h-16 w-16 items-center justify-center rounded-full bg-surface-container-high text-on-surface-variant">
            <span className="material-symbols-outlined text-[32px]">
              folder_off
            </span>
          </div>
          <h3 className="font-title-lg text-title-lg mb-sm text-on-background">
            No hay proyectos registrados
          </h3>
          <p className="font-body-md text-body-md mx-auto max-w-md text-on-surface-variant">
            Crea el primer proyecto con el botón &apos;Nuevo proyecto&apos;.
          </p>
        </div>
      ) : (
        <div className="card-shadow overflow-hidden rounded-lg border border-outline-variant bg-surface-container-lowest">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-outline-variant">
                  <th className="font-label-sm text-label-sm bg-surface px-md py-sm text-left font-semibold tracking-wider text-on-surface-variant uppercase">
                    Nombre
                  </th>
                  <th className="font-label-sm text-label-sm bg-surface px-md py-sm text-left font-semibold tracking-wider text-on-surface-variant uppercase">
                    Fecha
                  </th>
                  <th className="font-label-sm text-label-sm bg-surface px-md py-sm text-left font-semibold tracking-wider text-on-surface-variant uppercase">
                    Monto
                  </th>
                  <th className="font-label-sm text-label-sm bg-surface px-md py-sm text-left font-semibold tracking-wider text-on-surface-variant uppercase">
                    Estado
                  </th>
                  <th className="font-label-sm text-label-sm bg-surface px-md py-sm text-right font-semibold tracking-wider text-on-surface-variant uppercase">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="font-body-md text-body-md">
                {paginatedProyectos.map((proyecto) => {
                  const canManage = proyecto.created_by === currentUserId;

                  return (
                    <tr
                      key={proyecto.id}
                      className="group border-b border-outline-variant transition-colors hover:bg-surface-container-low"
                    >
                      <td className="px-md py-md font-medium text-primary">
                        {proyecto.nombre}
                      </td>
                      <td className="px-md py-md text-on-surface-variant">
                        {formatDate(proyecto.fecha_inicio)}
                      </td>
                      <td className="px-md py-md text-on-surface-variant">
                        {formatCurrency(proyecto.monto)}
                      </td>
                      <td className="px-md py-md">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-1 text-[10px] font-bold tracking-wide uppercase ${estadoBadgeClass(proyecto.estado)}`}
                        >
                          {formatEstadoLabel(proyecto.estado)}
                        </span>
                      </td>
                      <td className="px-md py-md text-right">
                        {canManage ? (
                          <div className="flex justify-end gap-sm opacity-50 transition-opacity group-hover:opacity-100">
                            <button
                              type="button"
                              onClick={() => setEditingProyecto(proyecto)}
                              className="text-on-surface-variant transition-colors hover:text-secondary"
                              title="Edit"
                              aria-label={`Editar ${proyecto.nombre}`}
                            >
                              <span
                                className="material-symbols-outlined"
                                style={{ fontSize: 20 }}
                              >
                                edit
                              </span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeletingProyecto(proyecto)}
                              className="text-on-surface-variant transition-colors hover:text-error"
                              title="Delete"
                              aria-label={`Eliminar ${proyecto.nombre}`}
                            >
                              <span
                                className="material-symbols-outlined"
                                style={{ fontSize: 20 }}
                              >
                                delete
                              </span>
                            </button>
                          </div>
                        ) : (
                          <span className="text-on-surface-variant">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between border-t border-outline-variant bg-surface-container-lowest px-md py-sm font-label-md text-label-md text-on-surface-variant">
            <span>
              Mostrando {rangeStart} a {rangeEnd} de {totalProyectos} proyectos
            </span>
            <div className="flex gap-xs">
              <button
                type="button"
                onClick={() => setPage((current) => Math.max(0, current - 1))}
                disabled={currentPage === 0}
                className="rounded p-1 transition-colors hover:bg-surface-container disabled:opacity-50"
                aria-label="Página anterior"
              >
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: 18 }}
                >
                  chevron_left
                </span>
              </button>
              <button
                type="button"
                onClick={() =>
                  setPage((current) => Math.min(totalPages - 1, current + 1))
                }
                disabled={currentPage >= totalPages - 1}
                className="rounded p-1 transition-colors hover:bg-surface-container disabled:opacity-50"
                aria-label="Página siguiente"
              >
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: 18 }}
                >
                  chevron_right
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      <ProyectoFormModal
        open={modalOpen}
        title="Nuevo proyecto"
        submitLabel="Crear proyecto"
        loading={loading}
        onClose={() => setModalOpen(false)}
        onSubmit={handleCreate}
      />

      <ProyectoFormModal
        open={Boolean(editingProyecto)}
        title="Editar proyecto"
        submitLabel="Guardar cambios"
        initialData={
          editingProyecto ? toFormData(editingProyecto) : emptyProyectoForm()
        }
        loading={loading}
        onClose={() => setEditingProyecto(null)}
        onSubmit={handleUpdate}
      />
      <ConfirmDeleteModal
        open={Boolean(deletingProyecto)}
        title="Eliminar proyecto"
        message={
          deletingProyecto
            ? `¿Eliminar el proyecto "${deletingProyecto.nombre}"? Esta acción no se puede deshacer.`
            : ""
        }
        loading={deleteLoading}
        onClose={() => {
          if (!deleteLoading) setDeletingProyecto(null);
        }}
        onConfirm={confirmDelete}
      />
    </>
  );
}
