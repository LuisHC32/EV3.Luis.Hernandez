"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AuthUser,
  authFetch,
  clearAuthSession,
  getAuthToken,
  getAuthUser,
} from "@/lib/auth-client";
import { Proyecto } from "@/types/proyecto";

export function useAuthProyectos() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProyectos = useCallback(async () => {
    const response = await authFetch("/api/proyectos");
    const data: unknown = await response.json();

    if (response.status === 401) {
      clearAuthSession();
      router.replace("/login");
      return;
    }

    if (!response.ok) {
      const errorPayload = data as { error?: string };
      throw new Error(errorPayload.error ?? "No se pudieron cargar los proyectos");
    }

    setProyectos(Array.isArray(data) ? (data as Proyecto[]) : []);
  }, [router]);

  useEffect(() => {
    const token = getAuthToken();
    const authUser = getAuthUser();

    if (!token || !authUser) {
      router.replace("/login");
      return;
    }

    setUser(authUser);

    loadProyectos()
      .catch((err: unknown) => {
        const message =
          err instanceof Error ? err.message : "Error al cargar los datos";
        setError(message);
      })
      .finally(() => setLoading(false));
  }, [loadProyectos, router]);

  return { user, proyectos, loading, error, loadProyectos };
}
