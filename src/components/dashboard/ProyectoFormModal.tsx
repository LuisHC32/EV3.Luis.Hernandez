"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  ESTADOS_PROYECTO,
  ProyectoFormData,
  emptyProyectoForm,
} from "@/types/proyecto";

type ProyectoFormModalProps = {
  open: boolean;
  title: string;
  submitLabel: string;
  initialData?: ProyectoFormData;
  loading: boolean;
  onClose: () => void;
  onSubmit: (data: ProyectoFormData) => void;
};

const inputClass =
  "font-body-md text-body-md block w-full rounded-lg border border-outline-variant bg-white py-sm px-md text-on-surface shadow-sm transition-shadow placeholder:text-on-surface-variant focus:border-secondary focus:ring-2 focus:ring-secondary";

export function ProyectoFormModal({
  open,
  title,
  submitLabel,
  initialData,
  loading,
  onClose,
  onSubmit,
}: ProyectoFormModalProps) {
  const [form, setForm] = useState<ProyectoFormData>(emptyProyectoForm());

  useEffect(() => {
    if (open) {
      setForm(initialData ?? emptyProyectoForm());
    }
  }, [open, initialData]);

  if (!open) return null;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit(form);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary-container/60 p-md backdrop-blur-sm">
      <div
        className="w-full max-w-lg overflow-hidden rounded-lg border border-outline-variant bg-surface-container-lowest shadow-lg"
        role="dialog"
        aria-modal="true"
        aria-labelledby="proyecto-form-title"
      >
        <div className="flex items-center justify-between border-b border-outline-variant px-lg py-md">
          <h3
            id="proyecto-form-title"
            className="font-title-lg text-title-lg text-on-background"
          >
            {title}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-xs text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-on-surface"
            aria-label="Cerrar"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form className="space-y-md p-lg" onSubmit={handleSubmit}>
          <div className="space-y-xs">
            <label
              className="font-label-md text-label-md block text-on-surface"
              htmlFor="proyecto-nombre"
            >
              Nombre del proyecto
            </label>
            <input
              id="proyecto-nombre"
              className={inputClass}
              value={form.nombre}
              onChange={(e) =>
                setForm((current) => ({ ...current, nombre: e.target.value }))
              }
              required
            />
          </div>

          <div className="grid gap-md sm:grid-cols-2">
            <div className="space-y-xs">
              <label
                className="font-label-md text-label-md block text-on-surface"
                htmlFor="proyecto-fecha"
              >
                Fecha de inicio
              </label>
              <input
                id="proyecto-fecha"
                type="date"
                className={inputClass}
                value={form.fecha_inicio}
                onChange={(e) =>
                  setForm((current) => ({
                    ...current,
                    fecha_inicio: e.target.value,
                  }))
                }
                required
              />
            </div>

            <div className="space-y-xs">
              <label
                className="font-label-md text-label-md block text-on-surface"
                htmlFor="proyecto-estado"
              >
                Estado
              </label>
              <select
                id="proyecto-estado"
                className={inputClass}
                value={form.estado}
                onChange={(e) =>
                  setForm((current) => ({ ...current, estado: e.target.value }))
                }
                required
              >
                {ESTADOS_PROYECTO.map((estado) => (
                  <option key={estado} value={estado}>
                    {estado}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-md sm:grid-cols-2">
            <div className="space-y-xs">
              <label
                className="font-label-md text-label-md block text-on-surface"
                htmlFor="proyecto-responsable"
              >
                Responsable
              </label>
              <input
                id="proyecto-responsable"
                className={inputClass}
                value={form.responsable}
                onChange={(e) =>
                  setForm((current) => ({
                    ...current,
                    responsable: e.target.value,
                  }))
                }
                required
              />
            </div>

            <div className="space-y-xs">
              <label
                className="font-label-md text-label-md block text-on-surface"
                htmlFor="proyecto-monto"
              >
                Monto (CLP)
              </label>
              <input
                id="proyecto-monto"
                type="number"
                min="0"
                step="1"
                className={inputClass}
                value={form.monto}
                onChange={(e) =>
                  setForm((current) => ({ ...current, monto: e.target.value }))
                }
                required
              />
            </div>
          </div>

          <div className="flex justify-end border-t border-outline-variant pt-md">
            <button
              type="button"
              onClick={onClose}
              className="font-label-md text-label-md rounded-lg border border-outline-variant px-md py-sm text-on-surface transition-colors hover:bg-surface-container-high"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="font-label-md text-label-md rounded-lg bg-secondary px-md py-sm text-on-secondary transition-opacity hover:opacity-90 disabled:opacity-60"
              style={{ marginLeft: 16 }}
            >
              {loading ? "Guardando..." : submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
