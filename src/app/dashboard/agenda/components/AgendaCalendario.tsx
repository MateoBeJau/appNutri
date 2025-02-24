"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridWeek from "@fullcalendar/timegrid";
import { useState, useEffect } from "react";
import AgendarConsultaModal from "./AgendarConsultaModal";
import ConsultaDetallesModal from "./ConsultaDetalleModal";


export default function AgendaCalendar() {
  const [events, setEvents] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedConsulta, setSelectedConsulta] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // 🔹 Función para obtener las consultas desde la API
  const fetchAppointments = async () => {
    try {
      const res = await fetch("/api/consultas");
      const data = await res.json();
  
      console.log("📌 Datos recibidos de la API:", data);
  
      const formattedEvents = data.map((consulta: any) => {
        console.log("🔍 Fecha de consulta desde la API:", consulta.fecha);
  
        if (!consulta.fecha || !consulta.horario) {
          console.error("❌ Consulta sin fecha u horario:", consulta);
          return null;
        }
  
        // 🔹 Convertir la fecha desde UTC sin alterar la zona horaria local
        const fechaISO = new Date(consulta.fecha);
        const fechaLocal = new Date(fechaISO.getTime() + fechaISO.getTimezoneOffset() * 60000); 
        // 🔹 Se ajusta la fecha para mantener la misma en la zona horaria local
        
        const [horaInicio, minutoInicio] = consulta.horario.split(" - ")[0].split(":").map(Number);
        const [horaFin, minutoFin] = consulta.horario.split(" - ")[1].split(":").map(Number);
  
        fechaLocal.setHours(horaInicio, minutoInicio, 0);
        const fechaFin = new Date(fechaLocal);
        fechaFin.setHours(horaFin, minutoFin, 0);
  
        return {
          id: consulta.id,
          title: `${consulta.paciente?.nombre || "Paciente"} - ${consulta.tipoConsulta}`,
          start: fechaLocal, // ✅ Ahora la fecha se mantiene correctamente en la zona horaria local
          end: fechaFin,
          backgroundColor: consulta.tipoConsulta === "primera" ? "green" : "blue",
          borderColor: consulta.tipoConsulta === "primera" ? "darkgreen" : "darkblue",
          textColor: "white",
          extendedProps: consulta,
        };
      }).filter(Boolean);
  
      console.log("📌 Eventos convertidos para FullCalendar:", formattedEvents);
      setEvents(formattedEvents);
    } catch (error) {
      console.error("❌ Error obteniendo consultas:", error);
    }
  };
  
  

  useEffect(() => {
    fetchAppointments();
  }, []);

  // 📌 Abrir modal para agendar nueva consulta
  const handleSelect = (slotInfo: any) => {
    console.log("📌 Slot seleccionado:", slotInfo);
    setSelectedSlot(slotInfo);
    setIsModalOpen(true);
  };

  // 📌 Abrir modal para ver detalles de una consulta
  const handleEventClick = (eventInfo: any) => {
    console.log("📌 Consulta seleccionada:", eventInfo.event.extendedProps);
    setSelectedConsulta(eventInfo.event.extendedProps);
    setIsDetailsModalOpen(true);
  };

  return (
    <div className="h-screen p-4">
      <h2 className="text-xl font-semibold mb-4">Agenda de Consultas</h2>
      <FullCalendar
        height="100%"
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, timeGridWeek]}
        initialView="timeGridWeek"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        events={events}
        slotMinTime="08:00:00"
        slotMaxTime="20:00:00"
        nowIndicator={true}
        selectable={true}
        editable={true}
        select={handleSelect} // 📌 Capturar selección de fecha/hora
        eventClick={handleEventClick} // 📌 Abrir detalles al hacer clic en una consulta
      />

      {/* Overlay para evitar clics en el calendario cuando el modal está abierto */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-transparent z-10" onClick={() => setIsModalOpen(false)} />
      )}

      {/* Modal para agendar nueva consulta */}
      {isModalOpen && (
        <AgendarConsultaModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          selectedSlot={selectedSlot}
          refreshCalendar={fetchAppointments} // Recargar el calendario al agendar
        />
      )}

      {/* Modal para ver detalles de consulta (editar/eliminar) */}
      {isDetailsModalOpen && (
        <ConsultaDetallesModal
          isOpen={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
          consulta={selectedConsulta}
          refreshCalendar={fetchAppointments} // Recargar el calendario al editar/eliminar
        />
      )}
    </div>
  );
}
