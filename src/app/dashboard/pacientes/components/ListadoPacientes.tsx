"use client";

import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";

interface Paciente {
  id: string;
  nombre: string;
  fechaNacimiento: string;
  telefono: string;
  email: string;
  genero: string;
  createdAt: string;
}

export default function ListadoPacientes() {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [filteredPacientes, setFilteredPacientes] = useState<Paciente[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterGenero, setFilterGenero] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPaciente, setSelectedPaciente] = useState<Paciente | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchPacientes();
  }, []);

  const fetchPacientes = async () => {
    try {
      const response = await fetch("/api/pacientes");
      const data = await response.json();
      setPacientes(data.pacientes);
      setFilteredPacientes(data.pacientes);
    } catch (error) {
      console.error("Error al obtener pacientes:", error);
      toast.error("❌ No se pudo cargar la lista de pacientes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtrados = pacientes.filter((paciente) =>
      paciente.nombre.toLowerCase().includes(search.toLowerCase())
    );

    if (filterGenero) {
      filtrados = filtrados.filter((paciente) => paciente.genero === filterGenero);
    }

    setFilteredPacientes(filtrados);
  }, [search, filterGenero, pacientes]);

  // 📌 Abrir modal de confirmación antes de eliminar
  const confirmarEliminarPaciente = (paciente: Paciente) => {
    setSelectedPaciente(paciente);
    setIsModalOpen(true);
  };

  // 📌 Función para eliminar paciente
  const handleEliminarPaciente = async () => {
    if (!selectedPaciente) return;

    setDeletingId(selectedPaciente.id);
    setIsModalOpen(false);

    try {
      const response = await fetch(`/api/pacientes/${selectedPaciente.id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Error al eliminar paciente");

      // ✅ Actualizar la lista después de eliminar
      setPacientes((prev) => prev.filter((p) => p.id !== selectedPaciente.id));
      setFilteredPacientes((prev) => prev.filter((p) => p.id !== selectedPaciente.id));

      toast.success("✅ Paciente eliminado con éxito");
    } catch (error) {
      console.error("Error al eliminar paciente:", error);
      toast.error("❌ No se pudo eliminar el paciente.");
    } finally {
      setDeletingId(null);
      setSelectedPaciente(null);
    }
  };

  // 🔹 Calcular edad desde `fechaNacimiento`
  const calcularEdad = (fechaNacimiento: string) => {
    const nacimiento = new Date(fechaNacimiento);
    const hoy = new Date();
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mesDiff = hoy.getMonth() - nacimiento.getMonth();
    if (mesDiff < 0 || (mesDiff === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return edad;
  };

  // 🔹 Formatear `createdAt` en formato DD/MM/YYYY
  const formatearFecha = (fecha: string) => {
    const date = new Date(fecha);
    const dia = date.getDate().toString().padStart(2, "0");
    const mes = (date.getMonth() + 1).toString().padStart(2, "0");
    const anio = date.getFullYear();
    return `${dia}/${mes}/${anio}`;
  };

  // 📌 Definir columnas de la tabla con Botones de Acciones
  const columns = [
    {
      name: "Nombre",
      selector: (row: Paciente) => (
        <Link href={`/dashboard/pacientes/${row.id}`} passHref>
          <span className="text-blue-600 font-semibold hover:text-blue-800 hover:underline transition duration-200">
            {row.nombre}
          </span>
        </Link>
      ),
      sortable: true,
      minWidth: "200px",
    },
    
    {
      name: "Edad",
      selector: (row: Paciente) => calcularEdad(row.fechaNacimiento) + " años",
      sortable: true,
      minWidth: "120px",
    },
    {
      name: "Teléfono",
      selector: (row: Paciente) => row.telefono,
      minWidth: "150px",
    },
    {
      name: "Email",
      selector: (row: Paciente) => row.email,
      minWidth: "200px",
    },

    {
      name: "Fecha Registro",
      selector: (row: Paciente) => formatearFecha(row.createdAt),
      sortable: true,
      minWidth: "100px",
    },
    {
      name: "Acciones",
      cell: (row: Paciente) => (
        <div className="flex gap-2">
          <Link href={`/dashboard/pacientes/${row.id}/editar`} passHref>
            <button className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600">
              ✏️
            </button>
          </Link>
          <button
            onClick={() => confirmarEliminarPaciente(row)}
            className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
          >
            🗑️
          </button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    }
    
  ];

  return (
    <div className="max-w-6xl mx-auto p-8 bg-white shadow-lg rounded-xl">
      <h1 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">📋 Listado de Pacientes</h1>

      {/* 🔍 Búsqueda y Filtros */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="🔍 Buscar por nombre..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 p-3 rounded-lg w-full sm:w-2/3 shadow-sm focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={filterGenero}
          onChange={(e) => setFilterGenero(e.target.value)}
          className="border border-gray-300 p-3 rounded-lg w-full sm:w-1/3 shadow-sm focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Todos</option>
          <option value="masculino">Masculino</option>
          <option value="femenino">Femenino</option>
          <option value="otro">Otro</option>
        </select>
      </div>

      {/* 📌 Tabla con paginación y ordenación */}
      <DataTable
        columns={columns}
        data={filteredPacientes}
        progressPending={loading}
        pagination
        highlightOnHover
        responsive
        striped
        noDataComponent={<p className="text-center text-gray-600">No hay pacientes registrados.</p>}
      />

      {/* 📌 MODAL DE CONFIRMACIÓN */}
      {isModalOpen && selectedPaciente && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-lg font-bold">⚠️ Confirmar Eliminación</h2>
            <p className="text-gray-600 mt-2">
              ¿Seguro que deseas eliminar a <strong>{selectedPaciente.nombre}</strong>?
            </p>
            <button onClick={handleEliminarPaciente} className="bg-red-500 text-white px-6 py-2 rounded-md mt-4">
              Sí, eliminar
            </button>
            <button onClick={() => setIsModalOpen(false)} className="bg-gray-500 text-white px-6 py-2 rounded-md ml-4">
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
