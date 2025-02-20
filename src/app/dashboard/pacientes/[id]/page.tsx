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
      const response = await fetch(`/api/pacientes/${id}`, {
        method: "DELETE",
      });
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

  if (loading)
    return <p className="text-center text-gray-600">Cargando paciente...</p>;
  if (!paciente)
    return <p className="text-center text-red-500">Paciente no encontrado.</p>;

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-8 mt-10">
      <h1 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">
        👤 Perfil del Paciente
      </h1>

      {/* 🔹 Información Personal */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 border-b pb-3 mb-4">
          📋 Información Personal
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <p className="text-lg text-gray-700">
            <strong>📌 Nombre:</strong> {paciente.nombre}
          </p>
          <p className="text-lg text-gray-700">
            <strong>📅 Fecha de Nacimiento:</strong>{" "}
            {formatearFecha(paciente.fechaNacimiento || "")}
          </p>
          <p className="text-lg text-gray-700">
            <strong>⚧ Género:</strong> {paciente.genero}
          </p>
          <p className="text-lg text-gray-700">
            <strong>📞 Teléfono:</strong> {paciente.telefono}
          </p>
          <p className="text-lg text-gray-700">
            <strong>📧 Email:</strong> {paciente.email}
          </p>
          <p className="text-lg text-gray-700">
            <strong>📆 Registrado el:</strong>{" "}
            {formatearFecha(paciente.createdAt)}
          </p>
        </div>
      </div>

      <hr className="border-gray-300 my-4" />

      {/* 🔹 Datos Clínicos */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 border-b pb-3 mb-4">
          💉 Datos Clínicos
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <p className="text-lg text-gray-700">
            <strong>⚖️ Peso:</strong> {paciente.peso} kg
          </p>
          <p className="text-lg text-gray-700">
            <strong>📏 Altura:</strong> {paciente.altura} cm
          </p>
          <p className="text-lg text-gray-700">
            <strong>📊 IMC:</strong> {paciente.imc}
          </p>
        </div>

        {paciente.patologias.length > 0 && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold text-gray-800">
              💊 Patologías
            </h3>
            <ul className="flex flex-wrap gap-2">
              {paciente.patologias.map((patologia, index) => (
                <li
                  key={index}
                  className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-medium"
                >
                  {patologia}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <hr className="border-gray-300 my-4" />

      {/* 🔹 Estilo de Vida */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 border-b pb-3 mb-4">
          🏡 Estilo de Vida
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {paciente.horariosComida && (
            <p className="text-lg text-gray-700">
              <strong>🍽️ Horarios de Comida:</strong> {paciente.horariosComida}
            </p>
          )}
          {paciente.tiemposTrabajo && (
            <p className="text-lg text-gray-700">
              <strong>🕒 Tiempos de Trabajo:</strong> {paciente.tiemposTrabajo}
            </p>
          )}
          {paciente.frecuenciaEntrenamiento && (
            <p className="text-lg text-gray-700">
              <strong>🏋️ Frecuencia de Entrenamiento:</strong>{" "}
              {paciente.frecuenciaEntrenamiento}
            </p>
          )}
          {paciente.aguaDiaria && (
            <p className="text-lg text-gray-700">
              <strong>💧 Consumo de Agua:</strong> {paciente.aguaDiaria} L
            </p>
          )}
          {paciente.horasSueno && (
            <p className="text-lg text-gray-700">
              <strong>😴 Horas de Sueño:</strong> {paciente.horasSueno} h
            </p>
          )}
          {paciente.consumoAlcoholTabaco && (
            <p className="text-lg text-gray-700">
              <strong>🚬 Alcohol/Tabaco:</strong>{" "}
              {paciente.consumoAlcoholTabaco}
            </p>
          )}
        </div>
      </div>

      <hr className="border-gray-300 my-4" />

      {/* 🔹 Preferencias Alimenticias */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 border-b pb-3 mb-4">
          🍽️ Preferencias Alimenticias
        </h2>
        {paciente.gustos.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              ✅ Gustos Alimenticios
            </h3>
            <ul className="flex flex-wrap gap-2">
              {paciente.gustos.map((gusto, index) => (
                <li
                  key={index}
                  className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium"
                >
                  {gusto}
                </li>
              ))}
            </ul>
          </div>
        )}

        {paciente.alergias.length > 0 && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold text-gray-800">⚠️ Alergias</h3>
            <ul className="flex flex-wrap gap-2">
              {paciente.alergias.map((alergia, index) => (
                <li
                  key={index}
                  className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium"
                >
                  {alergia}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <hr className="border-gray-300 my-4" />

      {/* 🔹 Objetivos Nutricionales */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 border-b pb-3 mb-4">
          🎯 Objetivos Nutricionales
        </h2>
        <p className="text-lg text-gray-700">
          <strong>🎯 Objetivo Corto Plazo:</strong> {paciente.objetivoCorto}
        </p>
        <p className="text-lg text-gray-700">
          <strong>🚀 Objetivo Largo Plazo:</strong> {paciente.objetivoLargo}
        </p>
      </div>

      <hr className="border-gray-300 my-4" />

      {/* 🔹 Notas del Nutricionista */}
      {paciente.notas && (
        <div>
          <h2 className="text-xl font-bold text-gray-800 border-b pb-3 mb-4">
            📝 Notas del Nutricionista
          </h2>
          <p className="text-lg text-gray-700 bg-gray-100 p-3 rounded-md">
            {paciente.notas}
          </p>
        </div>
      )}


      {/* 🔹 Botones de Acción */}
      <div className="flex justify-between mt-6">
        <Link
          href="/dashboard/pacientes"
          className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 transition"
        >
          ⬅ Volver
        </Link>
        <div className="flex gap-3">
          <Link
            href={`/dashboard/pacientes/${paciente.id}/editar`}
            className="bg-yellow-500 text-white px-6 py-2 rounded-md hover:bg-yellow-600 transition"
          >
            ✏️ Editar
          </Link>
          <button
            className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => setIsModalOpen(true)}
            disabled={deleting}
          >
            🗑️ {deleting ? "Eliminando..." : "Eliminar"}
          </button>
        </div>
      </div>

      {/* 🔹 Modal de Confirmación */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              ⚠️ Confirmar Eliminación
            </h2>
            <p className="text-gray-700 mb-4">
              ¿Estás seguro de que quieres eliminar al paciente{" "}
              <strong>{paciente.nombre}</strong>? Esta acción no se puede
              deshacer.
            </p>
            <div className="flex justify-end gap-4">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition"
                onClick={() => setIsModalOpen(false)}
              >
                Cancelar
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
                onClick={handleEliminarPaciente}
                disabled={deleting}
              >
                {deleting ? "Eliminando..." : "Sí, Eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
