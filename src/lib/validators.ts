import { z } from "zod";

const strongPasswordSchema = z
  .string()
  .min(8, "La clave debe tener al menos 8 caracteres")
  .regex(/[A-Z]/, "La clave debe incluir al menos una mayúscula")
  .regex(/[a-z]/, "La clave debe incluir al menos una minúscula")
  .regex(/[0-9]/, "La clave debe incluir al menos un número");

export const registerSchema = z.object({
  nombre: z.string().trim().min(2, "El nombre es obligatorio"),
  correo: z.email("El correo no es válido").trim().toLowerCase(),
  clave: strongPasswordSchema,
});

export const loginSchema = z.object({
  correo: z.email("El correo no es válido").trim().toLowerCase(),
  clave: z.string().min(1, "La clave es obligatoria"),
});

const requiredNonEmptyText = (label: string) =>
  z
    .string({ error: `${label} es obligatorio` })
    .trim()
    .min(1, `${label} no puede estar vacío`);

export const proyectoSchema = z.object({
  nombre: requiredNonEmptyText("El nombre del proyecto"),
  fecha_inicio: requiredNonEmptyText("La fecha de inicio").refine(
    (value) => !Number.isNaN(new Date(value).getTime()),
    "La fecha de inicio no es válida",
  ),
  estado: requiredNonEmptyText("El estado"),
  responsable: requiredNonEmptyText("El responsable"),
  monto: z
    .union([z.string(), z.number()], { error: "El monto es obligatorio" })
    .refine(
      (value) =>
        value !== "" &&
        value !== null &&
        value !== undefined &&
        !(typeof value === "string" && value.trim() === ""),
      "El monto no puede estar vacío",
    )
    .transform((value) =>
      typeof value === "string" ? Number(value.trim()) : value,
    )
    .pipe(
      z
        .number({ error: "El monto debe ser un número válido" })
        .nonnegative("El monto no puede ser negativo")
        .int("El monto debe ser un número entero (pesos chilenos, sin decimales)"),
    ),
});
