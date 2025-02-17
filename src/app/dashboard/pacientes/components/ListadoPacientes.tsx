"use client";

import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

type Paciente = {
  id: string;
  nombre: string;
  fechaNacimiento: string;
  genero: string;
  telefono: string;
  email: string;
};

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

  // 📌 Definir columnas de la tabla con Botones de Acciones
  const columns = [
    {
      name: "Nombre",
      selector: (row: Paciente) => row.nombre,
      sortable: true,
      minWidth: "180px",
    },
    {
      name: "Fecha Nac.",
      selector: (row: Paciente) => new Date(row.fechaNacimiento).toLocaleDateString("es-ES"),
      sortable: true,
      minWidth: "150px",
    },
    { name: "Género", selector: (row: Paciente) => row.genero, minWidth: "120px" },
    { name: "Teléfono", selector: (row: Paciente) => row.telefono, minWidth: "150px" },
    { name: "Email", selector: (row: Paciente) => row.email, minWidth: "250px" },

    // 📌 Nueva columna para acciones (Editar / Eliminar)
    {
      name: "Acciones",
      cell: (row: Paciente) => (
        <div className="flex gap-2">
          <button
            onClick={() => router.push(`/dashboard/pacientes/${row.id}/editar`)}
            className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600 transition duration-200"
          >
            ✏️ 
          </button>

          <button
            onClick={() => confirmarEliminarPaciente(row)}
            className={`bg-red-500 text-white px-3 py-1 rounded-md transition duration-200 ${
              deletingId === row.id ? "opacity-50 cursor-not-allowed" : "hover:bg-red-600"
            }`}
            disabled={deletingId === row.id}
          >
            {deletingId === row.id ? "⏳" : "🗑️"}
          </button>
        </div>
      ),
      ignoreRowClick: true,
      button: true,
    },
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
      <div className="overflow-hidden rounded-xl shadow-md">
        <DataTable
          columns={columns}
          data={filteredPacientes}
          progressPending={loading}
          pagination
          highlightOnHover
          responsive
          customStyles={{
            tableWrapper: { style: { overflowX: "auto" } },
            headRow: { style: { backgroundColor: "#f3f4f6", fontSize: "16px", fontWeight: "600" } },
            rows: { style: { fontSize: "15px", borderBottom: "1px solid #e5e7eb" } },
          }}
          onRowClicked={(row) => router.push(`/dashboard/pacientes/${row.id}`)}
        />
      </div>

      {/* 📌 MODAL DE CONFIRMACIÓN */}
      {isModalOpen && selectedPaciente && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-lg font-bold">⚠️ Confirmar Eliminación</h2>
            <p className="text-gray-600 mt-2">
              ¿Seguro que deseas eliminar a <strong>{selectedPaciente.nombre}</strong>?
            </p>
            <button
              onClick={handleEliminarPaciente}
              disabled={deletingId === selectedPaciente.id}
              className="bg-red-500 text-white px-6 py-2 rounded-md mt-4"
            >
              {deletingId === selectedPaciente.id ? "Eliminando..." : "Sí, eliminar"}
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
