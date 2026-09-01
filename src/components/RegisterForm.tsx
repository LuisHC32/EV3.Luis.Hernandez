"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { AuthMessage } from "@/components/AuthMessage";
import { registerSchema } from "@/lib/validators";

type RegisterResponse = {
  message?: string;
  error?: string;
  usuario?: {
    id: number;
    nombre: string;
    correo: string;
  };
};

export function RegisterForm() {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [messageType, setMessageType] = useState<"success" | "error" | null>(
    null,
  );
  const [message, setMessage] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setMessageType(null);

    const validation = registerSchema.safeParse({ nombre, correo, clave });
    if (!validation.success) {
      setMessageType("error");
      setMessage(
        validation.error.issues.map((issue) => issue.message).join("; "),
      );
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, correo, clave }),
      });

      const data = (await response.json()) as RegisterResponse;

      if (!response.ok) {
        setMessageType("error");
        setMessage(data.error ?? "No se pudo registrar el usuario");
        return;
      }

      setMessageType("success");
      setMessage(data.message ?? "Usuario registrado correctamente");
      setNombre("");
      setCorreo("");
      setClave("");
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
          htmlFor="name"
        >
          Nombre
        </label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-md">
            <span className="material-symbols-outlined text-[20px] text-on-surface-variant">
              person
            </span>
          </div>
          <input
            className="font-body-md text-body-md block w-full rounded-lg border border-outline-variant bg-white py-md pr-md pl-2xl text-on-surface shadow-sm transition-shadow placeholder:text-on-surface-variant focus:border-secondary focus:ring-2 focus:ring-secondary"
            id="name"
            name="name"
            placeholder="Nombre completo"
            required
            type="text"
            autoComplete="name"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </div>
      </div>

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
        <label
          className="font-label-md text-label-md block text-on-surface"
          htmlFor="password"
        >
          Contraseña
        </label>
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
            autoComplete="new-password"
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
        <p className="font-label-md text-label-md text-on-surface-variant">
          Mínimo 8 caracteres, con mayúscula, minúscula y número.
        </p>
      </div>

      <button
        className="font-label-md text-label-md flex w-full justify-center rounded-lg border border-transparent bg-secondary px-lg py-md text-white shadow-sm transition-all hover:bg-on-secondary-fixed-variant focus:ring-2 focus:ring-secondary focus:ring-offset-2 focus:outline-none active:scale-[0.98] disabled:opacity-60"
        type="submit"
        disabled={loading}
      >
        {loading ? "Registrando..." : "Registrarse"}
      </button>

      <AuthMessage type={messageType} text={message} />

      <div className="pt-md text-center">
        <p className="font-body-md text-body-md text-on-surface-variant">
          ¿Ya tienes una cuenta?{" "}
          <Link
            href="/login"
            className="font-label-md text-label-md ml-xs text-secondary transition-colors hover:text-on-secondary-fixed-variant"
          >
            Iniciar sesión
          </Link>
        </p>
      </div>
    </form>
  );
}
