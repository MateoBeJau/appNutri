"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

type Paciente = {
  id: string;
  nombre: string;
  fechaNacimiento: string;
  genero: string;
  telefono: string;
  email: string;
  peso: number;
  altura: number;
  imc: number;
  gustos: string[];
  alergias: string[];
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
      console.error("Error al obtener paciente:", error);
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
      console.error("Error al eliminar paciente:", error);
      toast.error("❌ No se pudo eliminar el paciente");
    } finally {
      setDeleting(false);
      setIsModalOpen(false);
    }
  };

  if (loading) return <p className="text-center text-gray-600">Cargando paciente...</p>;
  if (!paciente) return <p className="text-center text-red-500">Paciente no encontrado.</p>;

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-8 mt-10">
      <h1 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">👤 Perfil del Paciente</h1>

      {/* 🔹 Información básica */}
      <div className="grid grid-cols-2 gap-6 border-b pb-6 mb-6">
        <p className="text-lg text-gray-700"><strong>📌 Nombre:</strong> {paciente.nombre}</p>
        <p className="text-lg text-gray-700"><strong>📅 Fecha de Nacimiento:</strong> {new Date(paciente.fechaNacimiento).toLocaleDateString("es-ES")}</p>
        <p className="text-lg text-gray-700"><strong>⚧ Género:</strong> {paciente.genero}</p>
        <p className="text-lg text-gray-700"><strong>📞 Teléfono:</strong> {paciente.telefono}</p>
        <p className="text-lg text-gray-700"><strong>📧 Email:</strong> {paciente.email}</p>
      </div>

      {/* 🔹 Datos de salud */}
      <div className="grid grid-cols-2 gap-6 border-b pb-6 mb-6">
        <p className="text-lg text-gray-700"><strong>⚖️ Peso:</strong> {paciente.peso} kg</p>
        <p className="text-lg text-gray-700"><strong>📏 Altura:</strong> {paciente.altura} cm</p>
        <p className="text-lg text-gray-700"><strong>📊 IMC:</strong> {paciente.imc}</p>
      </div>

      {/* 🔹 Gustos alimenticios */}
      {paciente.gustos?.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">🍽️ Gustos y preferencias</h2>
          <ul className="flex flex-wrap gap-2">
            {paciente.gustos.map((gusto, index) => (
              <li key={index} className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">{gusto}</li>
            ))}
          </ul>
        </div>
      )}

      {/* 🔹 Alergias alimentarias */}
      {paciente.alergias?.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">⚠️ Alergias e intolerancias</h2>
          <ul className="flex flex-wrap gap-2">
            {paciente.alergias.map((alergia, index) => (
              <li key={index} className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-medium">{alergia}</li>
            ))}
          </ul>
        </div>
      )}

      {/* 🔙 Botones de Acción */}
      <div className="flex justify-between mt-6">
        <Link href="/dashboard/pacientes" className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600">
          ⬅ Volver a la lista
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

      {/* 📌 MODAL DE CONFIRMACIÓN */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center">
            <h2 className="text-lg font-bold text-gray-800">⚠️ Confirmar Eliminación</h2>
            <p className="text-gray-600 mt-2">¿Seguro que deseas eliminar este paciente?</p>
            <div className="flex justify-center mt-4 gap-4">
              <button onClick={() => setIsModalOpen(false)} className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600">
                Cancelar
              </button>
              <button onClick={handleEliminarPaciente} disabled={deleting} className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600">
                {deleting ? "Eliminando..." : "Sí, eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
