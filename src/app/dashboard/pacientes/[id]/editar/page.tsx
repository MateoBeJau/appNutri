"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useRouter, useParams } from "next/navigation";
import FormField from "@/app/components/FormField";
import { PlusCircle, Trash2 } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

type Paciente = {
  id: string;
  nombre: string;
  fechaNacimiento: string;
  genero: string;
  telefono: string;
  email: string;
  peso: number;
  altura: number;
  imc: number;
  gustos: { value: string }[];
  alergias: { value: string }[];
};

export default function EditarPaciente() {
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const params = useParams<{ id: string }>();

  const { register, handleSubmit, setValue, control, watch } = useForm<Paciente>({
    mode: "onChange",
  });

  const { fields: gustos, append: agregarGusto, remove: eliminarGusto } = useFieldArray({
    control,
    name: "gustos",
  });

  const { fields: alergias, append: agregarAlergia, remove: eliminarAlergia } = useFieldArray({
    control,
    name: "alergias",
  });

  useEffect(() => {
    if (!params.id) return;
    fetchPaciente();
  }, [params.id]);

  const fetchPaciente = async () => {
    try {
      const response = await fetch(`/api/pacientes/${params.id}`);
      if (!response.ok) throw new Error("Error al obtener paciente");
      const data = await response.json();

      data.gustos = data.gustos?.map((g: string) => ({ value: g })) || [];
      data.alergias = data.alergias?.map((a: string) => ({ value: a })) || [];

      Object.keys(data).forEach((key) => {
        setValue(key as keyof Paciente, data[key]);
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: Paciente) => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/pacientes/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          gustos: data.gustos.map((g) => g.value),
          alergias: data.alergias.map((a) => a.value),
        }),
      });

      if (!response.ok) throw new Error("Error al actualizar paciente");

      toast.success("✅ Paciente actualizado con éxito!");
      setIsModalOpen(false);
      setTimeout(() => {
        router.push("/dashboard/pacientes");
      }, 1500);
    } catch (error) {
      console.error("Error en la actualización:", error);
      toast.error("❌ No se pudo actualizar el paciente.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">✏️ Editar Paciente</h1>

      {loading ? (
        <p className="text-gray-600 text-center">Cargando datos del paciente...</p>
      ) : (
        <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
        {/* Datos básicos */}
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Nombre" type="text" id="nombre" register={register} />
          <FormField label="Fecha de nacimiento" type="date" id="fechaNacimiento" register={register} />
          <FormField
            label="Género"
            type="select"
            id="genero"
            register={register}
            options={[
              { value: "masculino", label: "Masculino" },
              { value: "femenino", label: "Femenino" },
              { value: "otro", label: "Otro" },
            ]}
          />
          <FormField label="Teléfono" type="text" id="telefono" register={register} />
          <FormField label="Correo electrónico" type="email" id="email" register={register} />
        </div>

        {/* Datos clínicos */}
        <h2 className="text-xl font-semibold text-gray-700 mt-4">Datos Clínicos</h2>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Peso (kg)" type="number" id="peso" register={register} />
          <FormField label="Altura (cm)" type="number" id="altura" register={register} />
        </div>

        {/* IMC Calculado Automáticamente */}
        <div>
          <label className="block text-sm font-medium text-gray-700">IMC</label>
          <input
            type="text"
            value={
              watch("peso") && watch("altura")
                ? (watch("peso") / ((watch("altura") / 100) ** 2)).toFixed(2)
                : ""
            }
            readOnly
            className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
          />
        </div>

        {/* Preferencias Alimenticias */}
        <div className="bg-gray-50 p-4 rounded-md shadow">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">Preferencias Alimenticias</h2>
          <div className="grid grid-cols-2 gap-4">
            {/* Gustos */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Gustos</label>
              <ul className="mt-2">
                {gustos.map((gusto, index) => (
                  <li key={index} className="flex justify-between text-sm text-gray-700 border-b py-1">
                    {gusto.value}
                    <button type="button" onClick={() => eliminarGusto(index)}>
                      <Trash2 className="w-4 h-4 text-red-500 hover:text-red-700" />
                    </button>
                  </li>
                ))}
              </ul>
              <input
                type="text"
                className="border p-2 rounded-md w-full mt-2"
                placeholder="Añadir gusto"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    const input = e.currentTarget;
                    if (input.value.trim()) {
                      agregarGusto({ value: input.value });
                      input.value = "";
                    }
                  }
                }}
              />
            </div>

            {/* Alergias */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Alergias</label>
              <ul className="mt-2">
                {alergias.map((alergia, index) => (
                  <li key={index} className="flex justify-between text-sm text-gray-700 border-b py-1">
                    {alergia.value}
                    <button type="button" onClick={() => eliminarAlergia(index)}>
                      <Trash2 className="w-4 h-4 text-red-500 hover:text-red-700" />
                    </button>
                  </li>
                ))}
              </ul>
              <input
                type="text"
                className="border p-2 rounded-md w-full mt-2"
                placeholder="Añadir alergia"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    const input = e.currentTarget;
                    if (input.value.trim()) {
                      agregarAlergia({ value: input.value });
                      input.value = "";
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>
                  {/* Botones */}
                  <div className="flex justify-between items-center mt-6">
            <Link href="/dashboard/pacientes" className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600">
              ⬅ Volver
            </Link>
            <button type="button" onClick={() => setIsModalOpen(true)} className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700">
              💾 Guardar Cambios
            </button>
          </div>
      </form>
      )}

      {/* Modal de Confirmación */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-lg font-bold">⚠️ Confirmar Guardado</h2>
            <p className="text-gray-600 mt-2">¿Seguro que deseas actualizar este paciente?</p>
            <button onClick={() => handleSubmit(onSubmit)()} className="bg-green-500 text-white px-6 py-2 rounded-md mt-4">
              {isSaving ? "Guardando..." : "Sí, guardar"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
