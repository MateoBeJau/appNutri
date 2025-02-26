
'use client'

import { useState, useEffect } from "react";

interface Paciente {
  id: string;
  nombre: string;
  peso: number;
  altura: number;
  patologias: string[];
  alergias: string[];
  objetivoCorto?: string;
}

export default function NutritionalPlanPage() {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState<Paciente | null>(null);
  const [prompt, setPrompt] = useState("");
  const [planGenerado, setPlanGenerado] = useState("");
  const [cargando, setCargando] = useState(false);

  // Obtener la lista de pacientes al cargar la página
  useEffect(() => {
    fetch("/api/pacientes")
      .then((res) => res.json())
      .then((data) => {
        console.log("Datos recibidos:", data);
        setPacientes(data.pacientes);
      })
      .catch((error) => console.error("Error al obtener pacientes:", error));
  }, []);
  

  // Al seleccionar un paciente se genera un prompt predeterminado
  useEffect(() => {
    if (pacienteSeleccionado) {
      let promptDefault = `Genera un plan nutricional personalizado para el paciente ${pacienteSeleccionado.nombre} `;
      promptDefault += `con un peso de ${pacienteSeleccionado.peso ?? "no especificado"} kg `;
      promptDefault += `y una altura de ${pacienteSeleccionado.altura ?? "no especificada"} m. `;
      promptDefault += `Patologías: ${pacienteSeleccionado.patologias && pacienteSeleccionado.patologias.length > 0 ? pacienteSeleccionado.patologias.join(", ") : "no especificadas"}. `;
      promptDefault += `Alergias: ${pacienteSeleccionado.alergias && pacienteSeleccionado.alergias.length > 0 ? pacienteSeleccionado.alergias.join(", ") : "no especificadas"}. `;
      promptDefault += `Objetivo: ${pacienteSeleccionado.objetivoCorto ?? "no especificado"}. `;
      promptDefault += `Proporciona opciones para desayuno, comida, cena y snacks.`;
      setPrompt(promptDefault);
    }
  }, [pacienteSeleccionado]);
  
  // Función para llamar al endpoint y generar el plan
  const handleGenerarPlan = async () => {
    setCargando(true);
    try {
      const response = await fetch("/api/planNutricional", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await response.json();
      setPlanGenerado(data.plan);
    } catch (error) {
      console.error("Error generando plan:", error);
    }
    setCargando(false);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Generación de Plan Nutricional</h1>
      
      {/* Selección de paciente */}
      <div>
        <label>
          <strong>Selecciona un paciente:</strong>
        </label>
        <select
          onChange={(e) => {
            const paciente = pacientes.find((p) => p.id === e.target.value);
            setPacienteSeleccionado(paciente || null);
            setPlanGenerado(""); // Limpiar el plan anterior al cambiar de paciente
          }}
          defaultValue=""
        >
          <option value="" disabled>
            -- Selecciona --
          </option>
          {pacientes.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nombre}
            </option>
          ))}
        </select>
      </div>

      {/* Mostrar y editar el prompt */}
      {pacienteSeleccionado && (
        <div style={{ marginTop: "1rem" }}>
          <h2>Prompt Generado</h2>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={6}
            style={{ width: "100%" }}
          />
          <div style={{ marginTop: "0.5rem" }}>
            <button onClick={handleGenerarPlan} disabled={cargando}>
              {cargando ? "Generando..." : "Generar Plan Nutricional"}
            </button>
          </div>
        </div>
      )}

      {/* Mostrar y editar el plan nutricional generado */}
      {planGenerado && (
        <div style={{ marginTop: "1rem" }}>
          <h2>Plan Nutricional Generado</h2>
          <textarea
            value={planGenerado}
            onChange={(e) => setPlanGenerado(e.target.value)}
            rows={10}
            style={{ width: "100%" }}
          />
        </div>
      )}
    </div>
  );
}
