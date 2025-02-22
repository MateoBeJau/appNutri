"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useState, useEffect } from "react";

export default function AgendaCalendar() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await fetch("/api/consultas"); 
        const data = await res.json();

        console.log("📌 Datos recibidos de la API:", data);

        const formattedEvents = data.map((consulta: any) => {
          const fechaInicio = new Date(consulta.fecha);
          const fechaFin = new Date(consulta.fecha);
        
          const [horaInicio, minutoInicio] = consulta.horario.split(" - ")[0].split(":").map(Number);
          const [horaFin, minutoFin] = consulta.horario.split(" - ")[1].split(":").map(Number);
        
          fechaInicio.setHours(horaInicio, minutoInicio, 0);
          fechaFin.setHours(horaFin, minutoFin, 0);
        
          return {
            title: `${consulta.paciente?.nombre || "Paciente"} - ${consulta.tipoConsulta}`,
            start: fechaInicio, // 🔹 Fecha de inicio con la hora correcta
            end: fechaFin,       // 🔹 Fecha de fin con la hora correcta
          };
        });
        

        console.log("📌 Eventos convertidos para FullCalendar:", formattedEvents);
        setEvents(formattedEvents);
      } catch (error) {
        console.error("❌ Error obteniendo consultas:", error);
      }
    };

    fetchAppointments();
  }, []);

  console.log("📌 Eventos en FullCalendar:", events); // Verifica si FullCalendar recibe eventos

  return (
    <div className="h-screen p-4">
      <h2 className="text-xl font-semibold mb-4">Agenda de Consultas</h2>
      <FullCalendar
        height="100%"
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek" // Vista semanal con horarios
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        events={events} // 📌 Aquí deberían mostrarse los eventos
        slotMinTime="08:00:00" // 📌 Define el rango de horario en la vista semanal
        slotMaxTime="20:00:00"
        nowIndicator={true} // 📌 Muestra la línea del tiempo actual
        selectable={true}
        editable={true}
      />
    </div>
  );
}
