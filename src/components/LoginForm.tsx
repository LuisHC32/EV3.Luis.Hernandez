"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { AuthMessage } from "@/components/AuthMessage";
import { getAuthToken, getAuthUser, setAuthSession } from "@/lib/auth-client";

type LoginResponse = {
  message?: string;
  error?: string;
  token?: string;
  usuario?: {
    id: number;
    nombre: string;
    correo: string;
  };
};

export function LoginForm() {
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [messageType, setMessageType] = useState<"success" | "error" | null>(
    null,
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (getAuthToken() && getAuthUser()) {
      window.location.replace("/dashboard");
    }
  }, []);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setMessageType(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo, clave }),
      });

      const data = (await response.json()) as LoginResponse;

      if (!response.ok) {
        setMessageType("error");
        setMessage(data.error ?? "No se pudo iniciar sesión");
        return;
      }

      if (!data.token) {
        setMessageType("error");
        setMessage("La respuesta del servidor no incluyó un token válido");
        return;
      }

      const user = data.usuario ?? {
        id: 0,
        nombre: correo,
        correo,
      };

      setAuthSession(data.token, user);
      window.location.assign("/dashboard");
      return;
    } catch {
      setMessageType("error");
      setMessage("Error de red al contactar el servidor");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="space-y-lg" onSubmit={onSubmit}>
      <div className="space-y-xs">
        <label
          className="font-label-md text-label-md block text-on-surface"
          htmlFor="email"
        >
          Correo electrónico
        </label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-md">
            <span className="material-symbols-outlined text-[20px] text-on-surface-variant">
              mail
            </span>
          </div>
          <input
            className="font-body-md text-body-md block w-full rounded-lg border border-outline-variant bg-white py-md pr-md pl-2xl text-on-surface shadow-sm transition-shadow placeholder:text-on-surface-variant focus:border-secondary focus:ring-2 focus:ring-secondary"
            id="email"
            name="email"
            placeholder="nombre@empresa.com"
            required
            type="email"
            autoComplete="email"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-xs">
        <div className="flex items-center justify-between">
          <label
            className="font-label-md text-label-md block text-on-surface"
            htmlFor="password"
          >
            Contraseña
          </label>
          <a
            className="font-label-sm text-label-sm text-secondary transition-colors hover:text-on-secondary-fixed-variant"
            href="#"
          >
            ¿Olvidaste tu contraseña?
          </a>
        </div>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-md">
            <span className="material-symbols-outlined text-[20px] text-on-surface-variant">
              lock
            </span>
          </div>
          <input
            className="font-body-md text-body-md block w-full rounded-lg border border-outline-variant bg-white py-md pr-2xl pl-2xl text-on-surface shadow-sm transition-shadow placeholder:text-on-surface-variant focus:border-secondary focus:ring-2 focus:ring-secondary"
            id="password"
            name="password"
            placeholder="••••••••"
            required
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            value={clave}
            onChange={(e) => setClave(e.target.value)}
          />
          <button
            className="absolute inset-y-0 right-0 flex items-center pr-md text-outline transition-colors hover:text-on-surface-variant"
            type="button"
            aria-label={
              showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
            }
            onClick={() => setShowPassword((visible) => !visible)}
          >
            <span className="material-symbols-outlined text-[20px]">
              {showPassword ? "visibility" : "visibility_off"}
            </span>
          </button>
        </div>
      </div>

      <button
        className="font-label-md text-label-md flex w-full justify-center rounded-lg border border-transparent bg-secondary px-lg py-md text-white shadow-sm transition-all hover:bg-on-secondary-fixed-variant focus:ring-2 focus:ring-secondary focus:ring-offset-2 focus:outline-none active:scale-[0.98] disabled:opacity-60"
        type="submit"
        disabled={loading}
      >
        {loading ? "Ingresando..." : "Iniciar sesión"}
      </button>

      <AuthMessage type={messageType} text={message} />

      <div className="pt-md text-center">
        <p className="font-body-md text-body-md text-on-surface-variant">
          ¿No tienes una cuenta?{" "}
          <Link
            href="/registro"
            className="font-label-md text-label-md ml-xs text-secondary transition-colors hover:text-on-secondary-fixed-variant"
          >
            Regístrate
          </Link>
        </p>
      </div>
    </form>
  );
}
