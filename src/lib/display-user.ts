import { AuthUser } from "@/lib/auth-client";

export function displayUserName(user: AuthUser): string {
  const nombre = user.nombre.trim();

  if (!nombre || nombre.includes("@") || nombre === user.correo) {
    return user.correo.split("@")[0] ?? "Usuario";
  }

  return nombre.split(" ")[0] ?? nombre;
}

export function userInitials(user: AuthUser): string {
  const nombre = displayUserName(user);
  const parts = nombre.split(/[\s._-]+/).filter(Boolean);

  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }

  return nombre.slice(0, 2).toUpperCase();
}
