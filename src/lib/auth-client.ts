export type AuthUser = {
  id: number;
  nombre: string;
  correo: string;
};

const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

function parseJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;

    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(json) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function userFromToken(token: string): AuthUser | null {
  const payload = parseJwtPayload(token);
  if (!payload?.sub || typeof payload.correo !== "string") {
    return null;
  }

  const id = Number(payload.sub);
  if (!Number.isInteger(id) || id <= 0) {
    return null;
  }

  return {
    id,
    correo: payload.correo,
    nombre:
      typeof payload.nombre === "string" ? payload.nombre : payload.correo,
  };
}

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function getAuthUser(): AuthUser | null {
  if (typeof window === "undefined") return null;

  const raw = window.localStorage.getItem(USER_KEY);
  if (raw) {
    try {
      return JSON.parse(raw) as AuthUser;
    } catch {
      window.localStorage.removeItem(USER_KEY);
    }
  }

  const token = getAuthToken();
  if (!token) return null;

  const user = userFromToken(token);
  if (user) {
    window.localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  return user;
}

export function setAuthSession(token: string, user: AuthUser) {
  window.localStorage.setItem(TOKEN_KEY, token);
  window.localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearAuthSession() {
  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(USER_KEY);
}

export async function authFetch(
  input: RequestInfo | URL,
  init: RequestInit = {},
) {
  const token = getAuthToken();
  if (!token) {
    throw new Error("No autenticado");
  }

  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bearer ${token}`);

  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(input, { ...init, headers });

  if (response.status === 401 && typeof window !== "undefined") {
    clearAuthSession();
    window.location.assign("/login");
  }

  return response;
}
