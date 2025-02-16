import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const fechaNacimiento = new Date(body.fechaNacimiento);

    const nuevoPaciente = await prisma.paciente.create({
      data: {
        nombre: body.nombre,
        fechaNacimiento: body.fechaNacimiento,
        genero: body.genero,
        telefono: body.telefono,
        email: body.email,
        peso: parseFloat(body.peso),
        altura: parseFloat(body.altura),
        imc: parseFloat(body.imc),
        gustos: body.gustos || [],
        alergias: body.alergias || [],
      },
    });

    return NextResponse.json({ message: "Paciente guardado", paciente: nuevoPaciente }, { status: 201 });
  } catch (error) {
    console.error("Error al guardar el paciente:", error);
    return NextResponse.json({ error: "Error al guardar el paciente" }, { status: 500 });
  }
}

export async function GET(){
  try {
    const pacientes = await prisma.paciente.findMany();
    return NextResponse.json ({pacientes},{status:200})
  }catch (error){
    console.error('Error al obtener los pcientes', error)
    return NextResponse.json({error:'Error al obtener los pacientes'},{status:500})
  }
}




// 📌 Editar paciente
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const paciente = await prisma.paciente.update({
      where: { id: params.id },
      data: body,
    });
    return NextResponse.json({ paciente });
  } catch (error) {
    return NextResponse.json({ error: "Error al actualizar paciente" }, { status: 500 });
  }
}