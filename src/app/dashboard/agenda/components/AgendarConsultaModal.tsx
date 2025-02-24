"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  CalendarDays,
  Clock,
  User,
  ClipboardCheck,
  XCircle,
} from "lucide-react";

export default function AgendarConsultaModal({
  isOpen,
  onClose,
  selectedSlot,
  refreshCalendar,
}: any) {
  const [pacientes, setPacientes] = useState([]);
  const [pacienteId, setPacienteId] = useState("");
  const [tipoConsulta, setTipoConsulta] = useState("primera");
  const [horario, setHorario] = useState("");
  const [fechaSeleccionada, setFechaSeleccionada] = useState("");

  useEffect(() => {
    const fetchPacientes = async () => {
      try {
        const res = await fetch("/api/pacientes");
        const data = await res.json();
        setPacientes(data.pacientes);
      } catch (error) {
        console.error("❌ Error obteniendo pacientes:", error);
      }
    };

    fetchPacientes();
  }, []);

  useEffect(() => {
    if (selectedSlot) {
      const fecha = new Date(selectedSlot.start);
      setFechaSeleccionada(fecha.toISOString().split("T")[0]); // ✅ Guardamos la fecha correctamente

      // 🔹 Extraer hora del `selectedSlot`
      const horaInicio = fecha.getHours();
      const minutoInicio = fecha.getMinutes();

      // 🔹 Asegurar que el horario tenga el formato correcto
      const formatoHora = (hora: number, min: number) =>
        `${hora.toString().padStart(2, "0")}:${min
          .toString()
          .padStart(2, "0")}`;

      const nuevoHorario = `${formatoHora(
        horaInicio,
        minutoInicio
      )} - ${formatoHora(horaInicio, minutoInicio + 30)}`;

      setHorario(nuevoHorario); // ✅ Asignamos el horario preseleccionado
    }
  }, [selectedSlot]);

  const handleAgendar = async () => {
    if (!pacienteId) {
      toast.error("Selecciona un paciente.");
      return;
    }

    const fechaLocal = new Date(`${fechaSeleccionada}T00:00:00`);
    const fechaUTC = new Date(
      fechaLocal.getTime() - fechaLocal.getTimezoneOffset() * 60000
    );

    const consulta = {
      pacienteId,
      fecha: fechaUTC.toISOString(),
      horario,
      tipoConsulta,
      estado: "pendiente",
    };

    try {
      const res = await fetch("/api/consultas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(consulta),
      });

      if (res.ok) {
        toast.success("Consulta agendada correctamente.");
        refreshCalendar();
        onClose();
      } else {
        toast.error("Error al agendar consulta.");
      }
    } catch (error) {
      toast.error("Error en la solicitud.");
      console.error("❌ Error en la solicitud:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[400px] border border-gray-300 z-50 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">
            Agendar Nueva Consulta
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <XCircle className="w-6 h-6" />
          </button>
        </div>

        {/* 🔹 Selección de Paciente */}
        <div>
          <label className="block text-gray-700 font-medium flex items-center gap-2">
            <User className="w-5 h-5 text-gray-500" />
            Paciente:
          </label>
          <select
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-400"
            value={pacienteId}
            onChange={(e) => setPacienteId(e.target.value)}
          >
            <option value="">Seleccionar...</option>
            {pacientes.map((paciente: any) => (
              <option key={paciente.id} value={paciente.id}>
                {paciente.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* 🔹 Selección de Fecha */}
        <div>
          <label className="block text-gray-700 font-medium flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-gray-500" />
            Fecha:
          </label>
          <input
            className="w-full p-2 border rounded bg-gray-100 text-gray-600"
            type="date"
            value={fechaSeleccionada}
            onChange={(e) => setFechaSeleccionada(e.target.value)}
          />
        </div>

        {/* 🔹 Selección de Horario */}
        <div>
          <label className="block text-gray-700 font-medium flex items-center gap-2">
            <Clock className="w-5 h-5 text-gray-500" />
            Horario:
          </label>
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

        {/* 🔹 Tipo de Consulta */}
        <div>
          <label className="block text-gray-700 font-medium flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5 text-gray-500" />
            Tipo de Consulta:
          </label>
          <select
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-400"
            value={tipoConsulta}
            onChange={(e) => setTipoConsulta(e.target.value)}
          >
            <option value="primera">Primera</option>
            <option value="seguimiento">Seguimiento</option>
          </select>
        </div>

        {/* 🔹 Botones de Acción */}
        <div className="flex justify-between space-x-4 mt-4">
          <button
            className="w-1/2 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 rounded-lg shadow-md 
               hover:from-blue-600 hover:to-blue-700 hover:scale-105 transition-all"
            onClick={handleAgendar}
          >
            📅 Agendar
          </button>

          <button
            className="w-1/2 bg-gradient-to-r from-gray-400 to-gray-500 text-white py-2 rounded-lg shadow-md 
               hover:from-gray-500 hover:to-gray-600 hover:scale-105 transition-all"
            onClick={onClose}
          >
            ❌ Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
