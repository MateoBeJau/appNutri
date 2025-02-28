"use client";

import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { format, isBefore, startOfDay } from "date-fns";
import { es } from "date-fns/locale";
import { FaUser } from "react-icons/fa";
import ConsultaDetalleModal from "../components/ConsultaDetalleModal";
import Link from "next/link";

const ConsultasRealizadas = () => {
  const [consultations, setConsultations] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredConsultations, setFilteredConsultations] = useState([]);
  const [selectedConsulta, setSelectedConsulta] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchConsultations = async () => {
      try {
        const response = await fetch("/api/consultas");
        const data = await response.json();
        const today = startOfDay(new Date());

        const formattedData = data
          .map((consulta: any) => {
            const fechaUTC = new Date(consulta.fecha);
            const fechaLocal = new Date(
              fechaUTC.getUTCFullYear(),
              fechaUTC.getUTCMonth(),
              fechaUTC.getUTCDate()
            );

            return {
              id: consulta.id,
              fecha: fechaLocal,
              formattedFecha: format(fechaLocal, "dd 'de' MMMM yyyy", { locale: es }),
              horario: consulta.horario,
              tipoConsulta: consulta.tipoConsulta,
              paciente: consulta.paciente,
              estado: consulta.estado,
            };
          })
          .filter((consulta: any) => isBefore(consulta.fecha, today)) // ✅ FILTRAMOS SOLO CONSULTAS PASADAS
          .sort((a: any, b: any) => b.fecha.getTime() - a.fecha.getTime()); // ✅ ORDENAMOS DE MÁS RECIENTE A MÁS ANTIGUA

        setConsultations(formattedData);
        setFilteredConsultations(formattedData);
      } catch (error) {
        console.error("Error al obtener consultas:", error);
      }
    };

    fetchConsultations();
  }, []);

  useEffect(() => {
    const result = consultations.filter((consulta: any) =>
      consulta.paciente.nombre.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredConsultations(result);
  }, [search, consultations]);

  const openModal = (consulta: any) => {
    setSelectedConsulta(consulta);
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelectedConsulta(null);
    setModalOpen(false);
  };

  const columns = [
    {
      name: "Paciente",
      selector: (row: any) => row.paciente.nombre,
      sortable: true,
    },
    {
      name: "Fecha",
      selector: (row: any) => row.formattedFecha,
      sortable: true,
      sortFunction: (a: any, b: any) => b.fecha.getTime() - a.fecha.getTime(), // Ordena de más reciente a más antigua
    },
    {
      name: "Horario",
      selector: (row: any) => row.horario,
      sortable: true,
    },
    {
      name: "Estado",
      selector: (row: any) => row.estado,
      sortable: true,
      cell: (row: any) => (
        <span
          className={`px-2 py-1 rounded-md text-white ${
            row.estado === "pendiente"
              ? "bg-yellow-500"
              : row.estado === "confirmada"
              ? "bg-green-500"
              : "bg-red-500"
          }`}
        >
          {row.estado}
        </span>
      ),
    },
    {
      name: "Acciones",
      cell: (row: any) => (
        <div className="flex gap-2">
          <button
            className="px-3 py-1 bg-blue-500 text-white rounded-md flex items-center gap-1"
            onClick={() => openModal(row)}
          >
            Ver Detalles
          </button>

          <Link href={`/dashboard/pacientes/${row.paciente.id}`} className="px-3 py-1 bg-gray-500 text-white rounded-md flex items-center gap-1">
            <FaUser /> Ver Perfil
          </Link>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Consultas Realizadas</h2>
      <div className="mb-4 flex justify-between">
        <input
          type="text"
          placeholder="Buscar paciente..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-1/3 p-2 border rounded-md"
        />
      </div>
      <DataTable
        columns={columns}
        data={filteredConsultations}
        pagination
        highlightOnHover
      />
      {modalOpen && selectedConsulta && (
        <ConsultaDetalleModal
          isOpen={modalOpen}
          consulta={selectedConsulta}
          onClose={closeModal}
          refreshCalendar={() => window.location.reload()}
        />
      )}
    </div>
  );
};

export default ConsultasRealizadas;
