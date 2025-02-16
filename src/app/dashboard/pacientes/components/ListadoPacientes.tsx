"use client";

import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { useRouter } from "next/navigation";

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

  // 📌 Función para eliminar paciente
  const handleEliminarPaciente = async (id: string) => {
    const confirmar = confirm("⚠️ ¿Seguro que deseas eliminar este paciente?");
    if (!confirmar) return;

    try {
      const response = await fetch(`/api/pacientes/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Error al eliminar paciente");

      // ✅ Actualizar la lista después de eliminar
      setPacientes((prev) => prev.filter((p) => p.id !== id));
      setFilteredPacientes((prev) => prev.filter((p) => p.id !== id));
      alert("✅ Paciente eliminado con éxito");
    } catch (error) {
      console.error("Error al eliminar paciente:", error);
      alert("❌ No se pudo eliminar el paciente");
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
            onClick={() => handleEliminarPaciente(row.id)}
            className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition duration-200"
          >
            🗑️ 
          </button>
        </div>
      ),
      ignoreRowClick: true, // Evita que el click en los botones abra el perfil
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
    </div>
  );
}
