import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client"; // 🔹 Importación directa

const prisma = new PrismaClient(); // 🔹 Instancia directa

export async function GET() {
  try {
    const consultas = await prisma.consulta.findMany({
      include: { paciente: true }, // Incluir datos del paciente
    });

    return NextResponse.json(consultas);
  } catch (error) {
    console.error("❌ Error al obtener consultas:", error);
    return NextResponse.json(
      { error: "Error obteniendo consultas" },
      { status: 500 }
    );
  }
}
