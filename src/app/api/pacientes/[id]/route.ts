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

// 📌 Editar paciente
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    console.log("Datos recibidos en API:", body); // 🔍 Ver qué datos llegan

    const paciente = await prisma.paciente.update({
      where: { id: params.id },
      data: {
        nombre: body.nombre,
        fechaNacimiento: body.fechaNacimiento ? new Date(body.fechaNacimiento) : undefined,
        genero: body.genero,
        telefono: body.telefono,
        email: body.email,
        peso: body.peso ? parseFloat(body.peso) : undefined,
        altura: body.altura ? parseFloat(body.altura) : undefined,
        imc: body.imc ? parseFloat(body.imc) : undefined,
        patologias: body.patologias || [],
        gustos: body.gustos || [],
        alergias: body.alergias || [],
        horariosComida: body.horariosComida || null,
        tiemposTrabajo: body.tiemposTrabajo || null,
        frecuenciaEntrenamiento: body.frecuenciaEntrenamiento || null,
        aguaDiaria: body.aguaDiaria ? parseFloat(body.aguaDiaria) : null,
        consumoAlcoholTabaco: body.consumoAlcoholTabaco || null,
        horasSueno: body.horasSueno ? parseFloat(body.horasSueno) : null,
        objetivoCorto: body.objetivoCorto || null,
        objetivoLargo: body.objetivoLargo || null,
        notas: body.notas || null,
      },
    });

    console.log("Paciente actualizado:", paciente); // 🔍 Verificar que Prisma devuelve datos

    return new Response(JSON.stringify({ message: "Paciente actualizado", paciente }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error al actualizar paciente:", error);
    return new Response(JSON.stringify({ error: "Error al actualizar paciente" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
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