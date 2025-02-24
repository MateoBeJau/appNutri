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

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("📌 Datos recibidos en API:", body);

    const nuevaConsulta = await prisma.consulta.create({
      data: {
        pacienteId: body.pacienteId,
        fecha: new Date(body.fecha),
        horario: body.horario,
        tipoConsulta: body.tipoConsulta,
        estado: "pendiente",
      },
    });

    return NextResponse.json(nuevaConsulta, { status: 201 });
  } catch (error: unknown) {
    console.error("❌ Error en el servidor:", error);
    
    // Verifica si el error es una instancia de Error y muestra su mensaje
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    // Si no, devuelve un mensaje genérico
    return NextResponse.json({ error: "Error al guardar consulta" }, { status: 500 });
  }
}
