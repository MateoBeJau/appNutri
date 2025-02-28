"use client";

import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import Link from "next/link";

type Paciente = {
  id: string;
  nombre: string;
};

export default function EstadisticaIMCPage() {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);

  useEffect(() => {
    const fetchPacientes = async () => {
      try {
        const res = await fetch("/api/pacientes");
        const data = await res.json();
  
        console.log("📌 Datos de pacientes recibidos:", data);
  
        if (Array.isArray(data.pacientes)) {
          setPacientes(data.pacientes); // ✅ Accedemos al array correcto
        } else {
          console.error("❌ La API no devolvió un array", data);
          setPacientes([]);
        }
      } catch (error) {
        console.error("❌ Error al obtener pacientes:", error);
        setPacientes([]);
      }
    };
  
    fetchPacientes();
  }, []);
  

  const columns = [
    {
      name: "Nombre",
      selector: (row: Paciente) => row.nombre,
      sortable: true,
    },
    {
      name: "Acciones",
      cell: (row: Paciente) => (
        <Link
          href={`/dashboard/estadistica/estadisticaImc/${row.id}`}
          className="px-3 py-1 bg-blue-500 text-white rounded-md"
        >
          Ver Consultas
        </Link>
      ),
    },
  ];

  return (
    <div className="p-6 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Lista de Pacientes (IMC)</h2>
      <DataTable columns={columns} data={pacientes} pagination highlightOnHover />
    </div>
  );
}
