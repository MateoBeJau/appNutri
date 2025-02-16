import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request, { params }: { params: { id: string } }) {
  if (!params?.id) {
    return NextResponse.json({ error: "ID de paciente requerido" }, { status: 400 });
  }

  try {
    const paciente = await prisma.paciente.findUnique({
      where: { id: params.id },
    });

    if (!paciente) {
      return NextResponse.json({ error: "Paciente no encontrado" }, { status: 404 });
    }

    return NextResponse.json(paciente);
  } catch (error) {
    console.error("Error al obtener paciente:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

// 📌 Actualizar paciente (PUT)
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const data = await req.json();

    const pacienteActualizado = await prisma.paciente.update({
      where: { id: params.id },
      data,
    });

    return NextResponse.json(pacienteActualizado);
  } catch (error) {
    console.error("Error al actualizar paciente:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}



// 📌 Eliminar paciente (DELETE)
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const paciente = await prisma.paciente.findUnique({
      where: { id: params.id },
    });

    if (!paciente) {
      return NextResponse.json({ error: "Paciente no encontrado" }, { status: 404 });
    }

    await prisma.paciente.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Paciente eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar paciente:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}