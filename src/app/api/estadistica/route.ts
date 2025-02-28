import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const pacienteId = searchParams.get("pacienteId");

    if (!pacienteId) {
      return NextResponse.json({ error: "Paciente ID es requerido" }, { status: 400 });
    }

    const consultas = await prisma.consulta.findMany({
      where: { pacienteId },
      include: { paciente: true }, // ✅ Incluir la relación con el paciente
      orderBy: { fecha: "desc" },
    });

    return NextResponse.json(consultas);
  } catch (error) {
    console.error("❌ Error al obtener consultas:", error);
    return NextResponse.json({ error: "Error obteniendo consultas" }, { status: 500 });
  }
}
