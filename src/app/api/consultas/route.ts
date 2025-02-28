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
    console.log("📌 Tipo de `peso` recibido:", typeof body.peso, body.peso);

    // Validar campos obligatorios
    if (!body.pacienteId || !body.fecha || !body.horario || !body.tipoConsulta) {
      return NextResponse.json({ error: "Faltan datos obligatorios" }, { status: 400 });
    }

    let peso = body.peso ? parseFloat(body.peso) : null; // Convertir `peso` a número o dejarlo `null`
    if (peso !== null && (isNaN(peso) || peso < 30 || peso > 300)) {
      return NextResponse.json({ error: "El peso debe estar entre 30kg y 300kg" }, { status: 400 });
    }

    // Crear la consulta en la BD
    const nuevaConsulta = await prisma.consulta.create({
      data: {
        pacienteId: body.pacienteId,
        fecha: new Date(body.fecha),
        horario: body.horario,
        tipoConsulta: body.tipoConsulta,
        estado: "pendiente",
        peso: peso, // ✅ Guardar el peso como número
      },
    });

    console.log("✅ Consulta guardada correctamente:", nuevaConsulta);
    return NextResponse.json(nuevaConsulta, { status: 201 });

  } catch (error) {
    console.error("❌ Error en el servidor:", error);
    return NextResponse.json({ error: "Error interno en el servidor", detalle: String(error) }, { status: 500 });
  }
}
