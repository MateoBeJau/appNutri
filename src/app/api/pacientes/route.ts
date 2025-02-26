import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 📌 Agregar un paciente
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const fechaNacimiento = new Date(body.fechaNacimiento); // ✅ Convertimos el string a Date correctamente

    const nuevoPaciente = await prisma.paciente.create({
      data: {
        nombre: body.nombre,
        fechaNacimiento, // 🔹 Se usa directamente como Date
        genero: body.genero,
        telefono: body.telefono,
        email: body.email,
        peso: parseFloat(body.peso),
        altura: parseFloat(body.altura),
        imc: parseFloat(body.imc),
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

    return NextResponse.json(
      { message: "Paciente guardado correctamente", paciente: nuevoPaciente },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Error al guardar el paciente:", error);
    return NextResponse.json(
      { error: "Error al guardar el paciente" },
      { status: 500 }
    );
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


export async function GET() {
  try {
    const pacientes = await prisma.paciente.findMany({
      select: {
        id: true,
        nombre: true,
        fechaNacimiento: true,
        genero: true,
        telefono: true,
        email: true,
        peso: true,
        altura: true,
        imc: true,
        patologias: true,
        gustos: true,
        alergias: true,
        horariosComida: true,
        tiemposTrabajo: true,
        frecuenciaEntrenamiento: true,
        aguaDiaria: true,
        consumoAlcoholTabaco: true,
        horasSueno: true,
        objetivoCorto: true,
        objetivoLargo: true,
        notas: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ pacientes }, { status: 200 });
  } catch (error) {
    console.error("❌ Error al obtener los pacientes:", error);
    return NextResponse.json(
      { error: "Error al obtener los pacientes" },
      { status: 500 }
    );
  }
}


