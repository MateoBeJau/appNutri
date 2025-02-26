// app/api/planNutricional/route.ts
import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Asegúrate de que está definida en tu .env.local
});

export async function POST(req: Request) {
    try {
      const body = await req.json();
      const prompt = body?.prompt;
  
      if (!prompt) {
        return NextResponse.json({ error: "Falta el prompt en la solicitud" }, { status: 400 });
      }
  
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",  // Reducimos costos usando gpt-3.5
        messages: [
          { role: "system", content: "Genera un plan nutricional basado en los datos del usuario." },
          { role: "user", content: prompt }
        ],
        max_tokens: 200,  // Limitamos la cantidad de tokens
        temperature: 0.7,
      });
  
      return NextResponse.json(
        { plan: response.choices[0]?.message?.content.trim() || "No se generó respuesta" },
        { status: 200 }
      );
    } catch (error: any) {
      console.error("Error en la API de OpenAI:", error);
  
      if (error.code === "insufficient_quota") {
        return NextResponse.json(
          { error: "Has superado tu cuota de uso en OpenAI. Revisa tu cuenta en OpenAI." },
          { status: 429 }
        );
      }
  
      return NextResponse.json(
        { error: "Error interno del servidor" },
        { status: 500 }
      );
    }
  }
  
  