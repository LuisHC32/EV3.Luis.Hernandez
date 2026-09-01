"use client";

import { createPortal } from "react-dom";

type SuccessModalProps = {
  open: boolean;
  title: string;
  message: string;
  onClose: () => void;
};

export function SuccessModal({
  open,
  title,
  message,
  onClose,
}: SuccessModalProps) {
  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/55 p-4"
      style={{ zIndex: 99999 }}
      role="presentation"
    >
      <div
        className="w-full max-w-md overflow-hidden rounded-xl border border-outline-variant bg-white shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="success-modal-title"
      >
        <div className="flex flex-col items-center p-8 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            <span className="material-symbols-outlined fill text-[36px]">
              check_circle
            </span>
          </div>
          <h3
            id="success-modal-title"
            className="mb-2 text-xl font-bold text-gray-900"
          >
            {title}
          </h3>
          <p className="mb-6 text-sm text-gray-600">{message}</p>
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-lg bg-[#2563EB] px-4 py-3 text-sm font-semibold text-white hover:bg-[#1d4ed8]"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
