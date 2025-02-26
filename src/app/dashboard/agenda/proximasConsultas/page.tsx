"use client";

import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { FaEdit, FaTrash, FaUser } from "react-icons/fa";
import ConsultaDetalleModal from "../components/ConsultaDetalleModal";


const UpcomingConsultations = () => {
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
        const formattedData = data.map((consulta: any) => ({
          id: consulta.id,
          fecha: new Date(consulta.fecha),
          formattedFecha: format(new Date(consulta.fecha), "dd 'de' MMMM yyyy", { locale: es }),
          horario: consulta.horario,
          paciente: consulta.paciente.nombre,
          estado: consulta.estado,
        })).sort((a, b) => a.fecha - b.fecha);
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
      consulta.paciente.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredConsultations(result);
  }, [search, consultations]);

  const openModal = (consulta: any) => {
    console.log("Abriendo modal con consulta:", consulta);
    setSelectedConsulta(consulta);
    setModalOpen(true);
  };

  const closeModal = () => {
    console.log("Cerrando modal");
    setSelectedConsulta(null);
    setModalOpen(false);
  };

  const columns = [
    {
      name: "Fecha",
      selector: (row: any) => row.formattedFecha,
      sortable: true,
    },
    {
      name: "Horario",
      selector: (row: any) => row.horario,
      sortable: true,
    },
    {
      name: "Paciente",
      selector: (row: any) => row.paciente,
      sortable: true,
    },
    {
      name: "Estado",
      selector: (row: any) => row.estado,
      sortable: true,
      cell: (row: any) => (
        <span
          className={`px-2 py-1 rounded-md text-white ${
            row.estado === "pendiente" ? "bg-yellow-500" :
            row.estado === "confirmada" ? "bg-green-500" : "bg-red-500"
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
            <FaEdit /> Editar
          </button>
          <button className="px-3 py-1 bg-red-500 text-white rounded-md flex items-center gap-1">
            <FaTrash /> Eliminar
          </button>
          <button className="px-3 py-1 bg-gray-500 text-white rounded-md flex items-center gap-1">
            <FaUser /> Ver Perfil
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Consultas Próximas</h2>
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
          consulta={selectedConsulta}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default UpcomingConsultations;
