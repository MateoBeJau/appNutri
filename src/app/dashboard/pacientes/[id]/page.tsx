"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

type Paciente = {
  id: string;
  nombre: string;
  fechaNacimiento?: string;
  genero: string;
  telefono: string;
  email: string;
  peso: number;
  altura: number;
  imc: number;
  patologias: string[];
  gustos: string[];
  alergias: string[];
  horariosComida?: string;
  tiemposTrabajo?: string;
  frecuenciaEntrenamiento?: string;
  aguaDiaria?: number;
  consumoAlcoholTabaco?: string;
  horasSueno?: number;
  objetivoCorto?: string;
  objetivoLargo?: string;
  notas?: string;
  createdAt: string;
};

export default function PerfilPaciente() {
  const { id } = useParams();
  const router = useRouter();
  const [paciente, setPaciente] = useState<Paciente | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetchPaciente();
  }, [id]);

  const fetchPaciente = async () => {
    try {
      const response = await fetch(`/api/pacientes/${id}`);
      if (!response.ok) throw new Error("Paciente no encontrado");
      const data = await response.json();
      setPaciente(data);
    } catch (error) {
      toast.error("❌ Error al obtener los datos del paciente.");
    } finally {
      setLoading(false);
    }
  };

  const handleEliminarPaciente = async () => {
    setDeleting(true);
    try {
      const response = await fetch(`/api/pacientes/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Error al eliminar paciente");

      toast.success("✅ Paciente eliminado con éxito");
      router.push("/dashboard/pacientes");
      router.refresh();
    } catch (error) {
      toast.error("❌ No se pudo eliminar el paciente");
    } finally {
      setDeleting(false);
      setIsModalOpen(false);
    }
  };

  const formatearFecha = (fecha: string) => {
    if (!fecha) return "No disponible";
    const date = new Date(fecha);
    return date.toLocaleDateString("es-ES");
  };

  if (loading) return <p className="text-center text-gray-600">Cargando paciente...</p>;
  if (!paciente) return <p className="text-center text-red-500">Paciente no encontrado.</p>;

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-8 mt-10">
      <h1 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">👤 Perfil del Paciente</h1>

      {/* 🔹 Información Personal */}
      <div className="grid grid-cols-2 gap-6 border-b pb-6 mb-6">
        <p className="text-lg text-gray-700"><strong>📌 Nombre:</strong> {paciente.nombre}</p>
        <p className="text-lg text-gray-700"><strong>📅 Fecha de Nacimiento:</strong> {formatearFecha(paciente.fechaNacimiento || "")}</p>
        <p className="text-lg text-gray-700"><strong>⚧ Género:</strong> {paciente.genero}</p>
        <p className="text-lg text-gray-700"><strong>📞 Teléfono:</strong> {paciente.telefono}</p>
        <p className="text-lg text-gray-700"><strong>📧 Email:</strong> {paciente.email}</p>
        <p className="text-lg text-gray-700"><strong>📆 Registrado el:</strong> {formatearFecha(paciente.createdAt)}</p>
      </div>

      {/* 🔹 Datos Clínicos */}
      <div className="grid grid-cols-2 gap-6 border-b pb-6 mb-6">
        <p className="text-lg text-gray-700"><strong>⚖️ Peso:</strong> {paciente.peso} kg</p>
        <p className="text-lg text-gray-700"><strong>📏 Altura:</strong> {paciente.altura} cm</p>
        <p className="text-lg text-gray-700"><strong>📊 IMC:</strong> {paciente.imc}</p>
        {paciente.patologias.length > 0 && (
          <p className="text-lg text-gray-700"><strong>💉 Patologías:</strong> {paciente.patologias.join(", ")}</p>
        )}
      </div>

      {/* 🔹 Estilo de Vida */}
      <div className="border-b pb-6 mb-6">
        {paciente.horariosComida && <p className="text-lg text-gray-700"><strong>🍽️ Horarios de Comida:</strong> {paciente.horariosComida}</p>}
        {paciente.tiemposTrabajo && <p className="text-lg text-gray-700"><strong>🕒 Tiempos de Trabajo:</strong> {paciente.tiemposTrabajo}</p>}
        {paciente.frecuenciaEntrenamiento && <p className="text-lg text-gray-700"><strong>🏋️ Frecuencia de Entrenamiento:</strong> {paciente.frecuenciaEntrenamiento}</p>}
        {paciente.aguaDiaria && <p className="text-lg text-gray-700"><strong>💧 Consumo de Agua:</strong> {paciente.aguaDiaria} L</p>}
        {paciente.horasSueno && <p className="text-lg text-gray-700"><strong>😴 Horas de Sueño:</strong> {paciente.horasSueno} h</p>}
        {paciente.consumoAlcoholTabaco && <p className="text-lg text-gray-700"><strong>🚬 Alcohol/Tabaco:</strong> {paciente.consumoAlcoholTabaco}</p>}
      </div>

      {/* 🔹 Objetivos Nutricionales */}
      <div className="border-b pb-6 mb-6">
        {paciente.objetivoCorto && <p className="text-lg text-gray-700"><strong>🎯 Objetivo Corto Plazo:</strong> {paciente.objetivoCorto}</p>}
        {paciente.objetivoLargo && <p className="text-lg text-gray-700"><strong>🚀 Objetivo Largo Plazo:</strong> {paciente.objetivoLargo}</p>}
      </div>

      {/* 🔹 Notas del Nutricionista */}
      {paciente.notas && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">📝 Notas del Nutricionista</h2>
          <p className="text-lg text-gray-700 bg-gray-100 p-3 rounded-md">{paciente.notas}</p>
        </div>
      )}

      {/* 🔙 Botones de Acción */}
      <div className="flex justify-between mt-6">
        <Link href="/dashboard/pacientes" className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600">
          ⬅ Volver
        </Link>
        <div className="flex gap-3">
          <Link href={`/dashboard/pacientes/${paciente.id}/editar`} className="bg-yellow-500 text-white px-6 py-2 rounded-md hover:bg-yellow-600">
            ✏️ Editar
          </Link>
          <button className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600" onClick={() => setIsModalOpen(true)}>
            🗑️ Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}
