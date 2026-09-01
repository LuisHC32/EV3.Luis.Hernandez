"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode } from "react";
import { AuthUser, clearAuthSession } from "@/lib/auth-client";
import { ProManageBrand } from "@/components/ProManageBrand";
import { displayUserName, userInitials } from "@/lib/display-user";

type DashboardShellProps = {
  user: AuthUser;
  children: ReactNode;
};

export function DashboardShell({ user, children }: DashboardShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const isPanel = pathname === "/dashboard";
  const isProyectos = pathname === "/proyectos";

  const activeNavClass =
    "group flex translate-x-1 items-center gap-md rounded-lg bg-secondary-container px-md py-sm text-on-secondary-container transition-transform";
  const inactiveNavClass =
    "group flex items-center gap-md rounded-lg px-md py-sm text-on-surface-variant transition-all hover:bg-surface-container-high";

  function handleLogout() {
    clearAuthSession();
    router.replace("/login");
  }

  return (
    <>
      <nav className="hidden h-full w-[300px] min-w-[300px] shrink-0 flex-col gap-md overflow-visible border-r border-outline-variant bg-surface-container px-md py-lg md:flex">
        <div className="mb-sm overflow-visible border-b border-outline-variant px-sm pt-md pb-[12px]">
          <ProManageBrand />
        </div>

        <div className="flex flex-1 flex-col gap-xs">
          <span className="font-label-sm text-label-sm mb-xs px-md tracking-wider text-on-surface-variant uppercase">
            MENÚ
          </span>
          <Link
            href="/dashboard"
            className={isPanel ? activeNavClass : inactiveNavClass}
          >
            <span className="material-symbols-outlined">dashboard</span>
            <span className="font-label-md text-label-md">Panel</span>
          </Link>
          <Link
            href="/proyectos"
            className={isProyectos ? activeNavClass : inactiveNavClass}
          >
            <span
              className={`material-symbols-outlined transition-colors ${isProyectos ? "" : "group-hover:text-primary"}`}
            >
              folder_open
            </span>
            <span
              className={`font-label-md text-label-md transition-colors ${isProyectos ? "" : "group-hover:text-primary"}`}
            >
              Proyectos
            </span>
          </Link>
        </div>

        <div className="mt-auto border-t-2 border-outline-variant pt-md">
          <div className="mx-md mb-md flex flex-col gap-sm rounded-xl border border-outline-variant bg-surface-container-low p-md">
            <div className="flex items-center gap-md">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-on-primary shadow-sm">
                <span className="text-sm font-bold">{userInitials(user)}</span>
              </div>
              <div className="flex flex-col overflow-hidden">
                <h2 className="font-label-md truncate font-bold text-on-surface">
                  {displayUserName(user)}
                </h2>
                <p className="font-label-sm truncate text-on-surface-variant">
                  {user.correo}
                </p>
              </div>
            </div>
            <div className="my-xs h-px bg-outline-variant opacity-50" />
            <button
              type="button"
              onClick={handleLogout}
              className="group flex w-full items-center gap-md rounded-md px-sm py-sm text-on-surface-variant transition-all hover:bg-error-container hover:text-error"
            >
              <span className="material-symbols-outlined text-[20px]">logout</span>
              <span className="font-label-md font-medium">Cerrar sesión</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="flex h-full min-w-0 flex-1 flex-col overflow-hidden">
        <div className="hidden items-center border-b border-outline-variant bg-background p-md md:flex">
          <button
            type="button"
            className="flex items-center justify-center rounded-md p-xs text-on-surface-variant transition-colors hover:bg-surface-container-high"
            title="Toggle Sidebar"
            aria-label="Toggle Sidebar"
          >
            <span className="material-symbols-outlined">menu</span>
          </button>
        </div>

        <header className="flex w-full items-center justify-between border-b border-outline-variant bg-surface-container-lowest px-lg py-md shadow-sm md:hidden">
          <ProManageBrand compact />
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-xs text-on-surface-variant transition-colors hover:text-error"
            aria-label="Cerrar sesión"
          >
            <span className="material-symbols-outlined text-[20px]">logout</span>
          </button>
        </header>

        <main className="flex-1 overflow-y-auto bg-[#F8FAFC] p-md md:p-2xl md:px-[48px]">
          {children}
        </main>
      </div>
    </>
  );
}
