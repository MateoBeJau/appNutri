import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 📌 Editar una consulta
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    let peso = body.peso ? parseFloat(body.peso) : null; // Convertimos `peso` a Float o lo dejamos `null`
    
    if (peso !== null && (isNaN(peso) || peso < 30 || peso > 300)) {
      return NextResponse.json({ error: "El peso debe estar entre 30kg y 300kg" }, { status: 400 });
    }

    const consulta = await prisma.consulta.update({
      where: { id: params.id },
      data: {
        tipoConsulta: body.tipoConsulta,
        horario: body.horario,
        estado: body.estado,
        fecha: new Date(body.fecha),
        peso: peso, // ✅ Guardamos el peso
      },
    });

    return NextResponse.json(consulta, { status: 200 });
  } catch (error) {
    console.error("❌ Error al actualizar consulta:", error);
    return NextResponse.json({ error: "Error al actualizar consulta" }, { status: 500 });
  }
}


// 📌 Eliminar una consulta
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const consultaId = params.id; // 🔹 Obtener el ID de la consulta

    if (!consultaId) {
      return NextResponse.json({ error: "ID de consulta no proporcionado" }, { status: 400 });
    }

    await prisma.consulta.delete({ where: { id: consultaId } });

    return NextResponse.json({ message: "Consulta eliminada correctamente" }, { status: 200 });
  } catch (error) {
    console.error("❌ Error al eliminar consulta:", error);
    return NextResponse.json({ error: "Error al eliminar consulta" }, { status: 500 });
  }
}
