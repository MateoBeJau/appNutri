"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { UserCircle, ArrowLeft } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

// 📌 Definir tipos explícitos para evitar errores
type Consulta = {
  id: string;
  fecha: string;
  horario: string;
  peso: number;
};

type Paciente = {
  id: string;
  nombre: string;
  altura: number; // ✅ Altura en metros
  paciente: Paciente;
};

export default function ConsultasPacientePage() {
  const { id } = useParams();
  const [consultas, setConsultas] = useState<Consulta[]>([]); // ✅ Ahora TypeScript sabe que consultas es un array de `Consulta`
  const [paciente, setPaciente] = useState<Paciente | null>(null); // ✅ Definimos correctamente el tipo de paciente

  useEffect(() => {
    const fetchConsultas = async () => {
      try {
        const res = await fetch(`/api/estadistica?pacienteId=${id}`);
        const data: Consulta[] = await res.json(); // ✅ TypeScript sabe que la respuesta es un array de `Consulta`

        if (Array.isArray(data) && data.length > 0) {
          setConsultas(data);
          setPaciente(data[0].paciente); // ✅ Ahora paciente se asigna correctamente
        } else {
          setConsultas([]);
          setPaciente(null);
        }
      } catch (error) {
        console.error("❌ Error al obtener consultas:", error);
        setConsultas([]);
        setPaciente(null);
      }
    };

    fetchConsultas();
  }, [id]);

  // 📌 Verificar si el paciente tiene altura válida
  const altura =
    paciente?.altura && paciente.altura > 0 ? paciente.altura : null;

  const alturaEnMetros = altura ? parseFloat(altura) / 100 : null; // ✅ Convertimos a número y a metros

  const datosGraficos = useMemo(() => {
    console.log("Altura en metros:", alturaEnMetros); // ✅ Debug para verificar

    if (!alturaEnMetros) return []; // 📌 Si no hay altura, no calculamos nada

    return consultas.map((consulta) => ({
      fecha: new Date(consulta.fecha).toLocaleDateString(),
      peso: consulta.peso,
      imc: parseFloat(
        (consulta.peso / (alturaEnMetros * alturaEnMetros)).toFixed(2)
      ), // ✅ Cálculo corregido
    }));
  }, [consultas, alturaEnMetros]);

  // 📌 Filtrar valores inválidos de IMC
  const datosIMC = datosGraficos.filter((d) => d.imc !== null && !isNaN(d.imc));

  return (
    <div className="p-6">
      {/* 🔙 Botón de Volver */}
      <Link
        href="/dashboard/estadistica/estadisticaImc"
        className="flex items-center text-blue-500 hover:text-blue-700"
      >
        <ArrowLeft className="w-5 h-5 mr-2" /> Volver a la lista de pacientes
      </Link>

      {/* 📌 Tarjeta de Paciente */}
      {paciente && (
        <div className="bg-white shadow-md rounded-lg p-4 mt-4 flex items-center space-x-4">
          <UserCircle className="w-12 h-12 text-gray-500" />
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {paciente.nombre}
            </h2>
            <p className="text-gray-600">ID: {paciente.id}</p>
            <p className="text-gray-600">
              Altura: {altura ? `${altura} m` : "No registrada"}
            </p>
          </div>
        </div>
      )}

      {/* 📊 Tabla de Consultas */}
      <div className="bg-white shadow-md rounded-lg mt-6 p-4">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          📋 Historial de Consultas
        </h3>
        {consultas.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-200 rounded-lg">
              <thead>
                <tr className="bg-gray-100 text-gray-700">
                  <th className="p-3 border border-gray-200 text-left">
                    Fecha
                  </th>
                  <th className="p-3 border border-gray-200 text-left">
                    Horario
                  </th>
                  <th className="p-3 border border-gray-200 text-left">
                    Peso (kg)
                  </th>
                  <th className="p-3 border border-gray-200 text-left">IMC</th>
                </tr>
              </thead>
              <tbody>
                {consultas.map((consulta, index) => {
                  // 📌 Convertimos la fecha al formato correcto
                  const fechaFormateada = new Date(
                    consulta.fecha
                  ).toLocaleDateString();

                  // 📌 Buscamos el IMC calculado en `datosGraficos`
                  const consultaGrafico = datosGraficos.find(
                    (d) => d.fecha === fechaFormateada
                  );

                  return (
                    <tr
                      key={consulta.id}
                      className={`border border-gray-200 ${
                        index % 2 === 0 ? "bg-gray-50" : "bg-white"
                      }`}
                    >
                      <td className="p-3">{fechaFormateada}</td>
                      <td className="p-3">{consulta.horario}</td>
                      <td className="p-3">{consulta.peso} kg</td>
                      <td className="p-3">
                        {consultaGrafico?.imc ?? "N/A"}
                      </td>{" "}
                      {/* ✅ Usamos el IMC ya calculado */}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-600 text-center py-4">
            No hay consultas registradas.
          </p>
        )}
      </div>

      {/* 📊 Gráfica de Evolución del Peso */}
      <div className="bg-white shadow-md rounded-lg mt-6 p-4">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          📊 Evolución del Peso
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={datosGraficos}>
            <XAxis dataKey="fecha" stroke="#8884d8" />
            <YAxis domain={["auto", "auto"]} />
            <Tooltip />
            <CartesianGrid strokeDasharray="3 3" />
            <Line
              type="monotone"
              dataKey="peso"
              stroke="#8884d8"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* 📊 Gráfica de Evolución del IMC */}
      {altura && datosIMC.length > 0 && (
        <div className="bg-white shadow-md rounded-lg mt-6 p-4">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            📊 Evolución del IMC
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={datosIMC}>
              <XAxis dataKey="fecha" stroke="#82ca9d" />
              <YAxis domain={["auto", "auto"]} />
              <Tooltip />
              <CartesianGrid strokeDasharray="3 3" />
              <Line
                type="monotone"
                dataKey="imc"
                stroke="#82ca9d"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
