import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/auth";
import { serializeProyecto } from "@/lib/proyecto-serializer";
import { proyectoSchema } from "@/lib/validators";
import { handleApiError, jsonError, jsonNoContent, jsonOk } from "@/lib/api";

type RouteContext = {
  params: Promise<{ id: string }>;
};

function parseProjectId(raw: string) {
  const id = Number(raw);
  if (!Number.isInteger(id) || id <= 0) {
    return null;
  }
  return id;
}

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return jsonError(
        "No autorizado. Token inexistente, inválido o expirado.",
        401,
      );
    }

    const { id: rawId } = await context.params;
    const id = parseProjectId(rawId);
    if (!id) {
      return jsonError("Identificador de proyecto inválido", 400);
    }

    const proyecto = await prisma.proyecto.findUnique({ where: { id } });
    if (!proyecto) {
      return jsonError("Proyecto no encontrado", 404);
    }

    return jsonOk(serializeProyecto(proyecto));
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: NextRequest, context: RouteContext) {
  return updateProyectoById(request, context);
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  return updateProyectoById(request, context);
}

async function updateProyectoById(request: NextRequest, context: RouteContext) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return jsonError(
        "No autorizado. Token inexistente, inválido o expirado.",
        401,
      );
    }

    const { id: rawId } = await context.params;
    const id = parseProjectId(rawId);
    if (!id) {
      return jsonError("Identificador de proyecto inválido", 400);
    }

    const existing = await prisma.proyecto.findUnique({ where: { id } });
    if (!existing) {
      return jsonError("Proyecto no encontrado", 404);
    }

    if (existing.created_by !== user.id) {
      return jsonError("No tienes permiso para editar este proyecto", 403);
    }

    const body = await request.json();
    const data = proyectoSchema.parse(body);

    const proyecto = await prisma.proyecto.update({
      where: { id },
      data: {
        nombre: data.nombre,
        fecha_inicio: new Date(data.fecha_inicio),
        estado: data.estado,
        responsable: data.responsable,
        monto: data.monto,
      },
    });

    return jsonOk(serializeProyecto(proyecto));
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return jsonError(
        "No autorizado. Token inexistente, inválido o expirado.",
        401,
      );
    }

    const { id: rawId } = await context.params;
    const id = parseProjectId(rawId);
    if (!id) {
      return jsonError("Identificador de proyecto inválido", 400);
    }

    const existing = await prisma.proyecto.findUnique({ where: { id } });
    if (!existing) {
      return jsonError("Proyecto no encontrado", 404);
    }

    if (existing.created_by !== user.id) {
      return jsonError("No tienes permiso para eliminar este proyecto", 403);
    }

    await prisma.proyecto.delete({ where: { id } });

    return jsonNoContent();
  } catch (error) {
    return handleApiError(error);
  }
}
