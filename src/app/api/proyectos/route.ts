import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/auth";
import { serializeProyecto } from "@/lib/proyecto-serializer";
import { proyectoSchema } from "@/lib/validators";
import { handleApiError, jsonError, jsonOk } from "@/lib/api";

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return jsonError("No autorizado. Token inexistente, inválido o expirado.", 401);
    }

    const proyectos = await prisma.proyecto.findMany({
      orderBy: { id: "desc" },
    });

    return jsonOk(proyectos.map(serializeProyecto));
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return jsonError("No autorizado. Token inexistente, inválido o expirado.", 401);
    }

    const body = await request.json();
    const data = proyectoSchema.parse(body);

    const proyecto = await prisma.proyecto.create({
      data: {
        nombre: data.nombre,
        fecha_inicio: new Date(data.fecha_inicio),
        estado: data.estado,
        responsable: data.responsable,
        monto: data.monto,
        created_by: user.id,
      },
    });

    return jsonOk(serializeProyecto(proyecto), 201);
  } catch (error) {
    return handleApiError(error);
  }
}
