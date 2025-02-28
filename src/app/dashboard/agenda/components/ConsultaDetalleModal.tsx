"use client";

import { UserCircle, Trash2, Save, XCircle } from "lucide-react";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function ConsultaDetallesModal({
  isOpen,
  onClose,
  consulta,
  refreshCalendar,
}: any) {
  const router = useRouter();
  const [pacienteNombre, setPacienteNombre] = useState("");
  const [tipoConsulta, setTipoConsulta] = useState("");
  const [fecha, setFecha] = useState("");
  const [horario, setHorario] = useState("");
  const [estado, setEstado] = useState("");
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [peso, setPeso] = useState("");

  useEffect(() => {
    if (consulta) {
      setPacienteNombre(consulta.paciente?.nombre || "Paciente");
      setTipoConsulta(consulta.tipoConsulta);
      setFecha(new Date(consulta.fecha).toISOString().split("T")[0]);
      setHorario(consulta.horario);
      setEstado(consulta.estado);
      setPeso(consulta.peso ? consulta.peso.toString() : ""); // Convertimos peso a string para el input
    }
  }, [consulta]);

  const handleGuardarCambios = async () => {
    try {
      const res = await fetch(`/api/consultas/${consulta.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tipoConsulta,
          horario,
          estado,
          fecha,
          peso: peso ? parseFloat(peso) : null, // ✅ Convertimos `peso` a Float o lo dejamos `null`
        }),
      });
  
      if (res.ok) {
        toast.success("Consulta actualizada correctamente.");
        refreshCalendar();
        onClose();
      } else {
        toast.error("Error al actualizar la consulta.");
      }
    } catch (error) {
      toast.error("Error en la solicitud.");
    }
  };
  

  const handleVerPerfilPaciente = () => {
    if (consulta?.paciente?.id) {
      router.push(`/dashboard/pacientes/${consulta.paciente.id}`);
    } else {
      toast.error("Paciente no encontrado.");
    }
  };

  const handleEliminarConsulta = async () => {
    try {
      const res = await fetch(`/api/consultas/${consulta.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Consulta eliminada correctamente.");
        refreshCalendar();
        onClose();
      } else {
        toast.error("Error al eliminar la consulta.");
      }
    } catch (error) {
      toast.error("Error en la solicitud.");
    } finally {
      setIsConfirmModalOpen(false);
    }
  };

  if (!isOpen || !consulta) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[400px] border border-gray-300 z-50 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">
            Detalles de la Consulta
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <XCircle className="w-6 h-6" />
          </button>
        </div>

        {/* 🔹 Paciente con botón de perfil */}
        <div>
          <label className="block text-gray-700 font-medium">Paciente:</label>
          <div className="flex items-center gap-2">
            <input
              className="w-full p-2 border rounded bg-gray-100"
              type="text"
              value={pacienteNombre}
              disabled
            />
            <button
              onClick={handleVerPerfilPaciente}
              title="Ver perfil del paciente"
            >
              <UserCircle className="w-7 h-7 text-blue-500 hover:text-blue-700 transition-all" />
            </button>
          </div>
        </div>

        {/* 🔹 Fecha */}
        <div>
          <label className="block text-gray-700 font-medium">Fecha:</label>
          <input
            className="w-full p-2 border rounded bg-gray-100"
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
          />
        </div>

        {/* 🔹 Horario */}
        <div>
          <label className="block text-gray-700 font-medium">Horario:</label>
          <select
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-400"
            value={horario}
            onChange={(e) => setHorario(e.target.value)}
          >
            {Array.from({ length: 11 }, (_, i) => {
              const hora = i + 9;
              return (
                <option key={hora} value={`${hora}:00 - ${hora}:30`}>
                  {hora}:00 - {hora}:30
                </option>
              );
            })}
          </select>
        </div>
        {/* 🔹 Peso del Paciente */}
        <div>
          <label className="block text-gray-700 font-medium">Peso (kg):</label>
          <input
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-400"
            type="number"
            min="30"
            max="300"
            step="0.1"
            value={peso}
            onChange={(e) => setPeso(e.target.value)}
          />
        </div>

        {/* 🔹 Tipo de Consulta */}
        <div>
          <label className="block text-gray-700 font-medium">
            Tipo de Consulta:
          </label>
          <select
            className="w-full p-2 border rounded"
            value={tipoConsulta}
            onChange={(e) => setTipoConsulta(e.target.value)}
          >
            <option value="primera">Primera</option>
            <option value="seguimiento">Seguimiento</option>
          </select>
        </div>

        {/* 🔹 Estado */}
        <div>
          <label className="block text-gray-700 font-medium">Estado:</label>
          <select
            className="w-full p-2 border rounded"
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
          >
            <option value="pendiente">Pendiente</option>
            <option value="confirmada">Confirmada</option>
            <option value="cancelada">Cancelada</option>
          </select>
        </div>

        {/* 🔹 Botones de acción */}
        <div className="flex justify-between">
          <button
            className="flex p-4 mr-2 items-center gap-2 w-1/2 bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-all"
            onClick={handleGuardarCambios}
          >
            <Save className="w-5 h-5" /> Guardar
          </button>

          <button
            className="flex  p-4 items-center gap-2 w-1/2 bg-red-500 text-white py-2 rounded hover:bg-red-600 transition-all"
            onClick={() => setIsConfirmModalOpen(true)}
          >
            <Trash2 className="w-5 h-5" /> Eliminar
          </button>
        </div>
      </div>

      {/* Modal de Confirmación */}
      {isConfirmModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[350px] border border-gray-300 z-50 text-center space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Eliminar Consulta
            </h2>
            <p className="text-gray-600">
              ¿Estás seguro de que deseas eliminar esta consulta?
            </p>
            <div className="flex justify-between">
              <button
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                onClick={() => setIsConfirmModalOpen(false)}
              >
                Cancelar
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                onClick={handleEliminarConsulta}
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
