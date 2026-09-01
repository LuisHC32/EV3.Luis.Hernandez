import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const protectedApiPrefixes = ["/api/proyectos"];

function getSecretKey() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET no configurado");
  }
  return new TextEncoder().encode(secret);
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtected = protectedApiPrefixes.some((prefix) =>
    pathname.startsWith(prefix),
  );

  if (!isProtected) {
    return NextResponse.next();
  }

  const header = request.headers.get("authorization");
  if (!header) {
    return NextResponse.json(
      { error: "No autorizado. Token inexistente." },
      { status: 401 },
    );
  }

  const [scheme, token] = header.split(" ");
  if (scheme?.toLowerCase() !== "bearer" || !token) {
    return NextResponse.json(
      { error: "No autorizado. Use Authorization: Bearer <token>." },
      { status: 401 },
    );
  }

  try {
    const { payload } = await jwtVerify(token, getSecretKey());

    if (!payload.sub) {
      return NextResponse.json(
        { error: "No autorizado. Token inválido." },
        { status: 401 },
      );
    }

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-user-id", String(payload.sub));
    if (typeof payload.correo === "string") {
      requestHeaders.set("x-user-correo", payload.correo);
    }
    if (typeof payload.nombre === "string") {
      requestHeaders.set("x-user-nombre", payload.nombre);
    }

    return NextResponse.next({
      request: { headers: requestHeaders },
    });
  } catch {
    return NextResponse.json(
      { error: "No autorizado. Token inválido o expirado." },
      { status: 401 },
    );
  }
}

export const config = {
  matcher: ["/api/proyectos", "/api/proyectos/:path*"],
};
