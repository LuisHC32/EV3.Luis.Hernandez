"use client";

import { createPortal } from "react-dom";

type ConfirmDeleteModalProps = {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export function ConfirmDeleteModal({
  open,
  title,
  message,
  confirmLabel = "Eliminar",
  loading = false,
  onClose,
  onConfirm,
}: ConfirmDeleteModalProps) {
  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/55 p-4"
      style={{ zIndex: 99998 }}
    >
      <div
        className="w-full max-w-md overflow-hidden rounded-lg border border-outline-variant bg-surface-container-lowest shadow-lg"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-delete-title"
      >
        <div className="flex flex-col items-center p-2xl text-center">
          <div className="mb-md flex h-16 w-16 items-center justify-center rounded-full bg-error-container text-error">
            <span className="material-symbols-outlined text-[36px]">delete</span>
          </div>
          <h3
            id="confirm-delete-title"
            className="font-title-lg text-title-lg mb-sm text-on-background"
          >
            {title}
          </h3>
          <p className="font-body-md text-body-md mb-xl text-on-surface-variant">
            {message}
          </p>
          <div className="flex w-full justify-center gap-md">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="font-label-md text-label-md min-w-[120px] rounded-lg border border-outline-variant bg-surface-container-lowest px-md py-sm text-on-surface transition-colors hover:bg-surface-container-high disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={loading}
              className="font-label-md text-label-md min-w-[120px] rounded-lg bg-error px-md py-sm text-on-error transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Eliminando..." : confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
