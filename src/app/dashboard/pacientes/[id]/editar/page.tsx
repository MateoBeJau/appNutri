"use client";

import { useState, useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useRouter, useParams } from "next/navigation";

import toast from "react-hot-toast";
import { ProgressBar } from "@/app/components/progress-bar";
import DatosBasicos from "@/app/components/DatosBasicos";
import DatosClinicos from "@/app/components/DatosClinicos";
import EstiloVida from "@/app/components/EstiloVida";
import ObjetivosNutricionales from "@/app/components/ObjetivosNutricionales";
import PreferenciasAlimenticias from "@/app/components/PreferenciasAlimenticias";
import ObservacionesAdicionales from "@/app/components/ObservacionesAdicionales";

export default function EditarPacienteForm() {
  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();
  const { id } = useParams();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    trigger,

    control,
    setValue,
  } = useForm({
    mode: "onChange",
  });

  // 🔹 Manejo de listas dinámicas
  const {
    fields: gustos,
    append: addGusto,
    remove: removeGusto,
  } = useFieldArray({ control, name: "gustos" });
  const {
    fields: alergias,
    append: addAlergia,
    remove: removeAlergia,
  } = useFieldArray({ control, name: "alergias" });
  const {
    fields: patologias,
    append: addPatologia,
    remove: removePatologia,
  } = useFieldArray({ control, name: "patologias" });

  // 🔹 Cargar datos del paciente desde la API
  useEffect(() => {
    if (!id) return;
    fetchPaciente();
  }, [id]);

  const fetchPaciente = async () => {
    try {
      const response = await fetch(`/api/pacientes/${id}`);
      if (!response.ok) throw new Error("Paciente no encontrado");
  
      const data = await response.json();
  
      // Convertir `fechaNacimiento` al formato YYYY-MM-DD
      if (data.fechaNacimiento) {
        data.fechaNacimiento = new Date(data.fechaNacimiento)
          .toISOString()
          .split("T")[0];
      }
  
      // 🔹 Convertir listas en el formato adecuado
      data.gustos = data.gustos?.map((item: string) => ({ id: String(Date.now()), name: item })) || [];
      data.alergias = data.alergias?.map((item: string) => ({ id: String(Date.now()), name: item })) || [];
      data.patologias = data.patologias?.map((item: string) => ({ id: String(Date.now()), name: item })) || [];
  
      // Cargar datos en el formulario
      Object.keys(data).forEach((key) => setValue(key as keyof typeof data, data[key]));
  
      console.log("Paciente cargado:", data);
    } catch (error) {
      toast.error("❌ Error al cargar el paciente.");
    } finally {
      setLoading(false);
    }
  };
  

  const onSubmit = async (data: any) => {
    setIsSaving(true);
    setErrorMessage(null);
  
    // Transformar listas para enviarlas como arrays de strings
    const pacienteActualizado = {
      ...data,
      imc: (parseFloat(data.peso) / ((parseFloat(data.altura) / 100) ** 2)).toFixed(2),
      fechaNacimiento: new Date(data.fechaNacimiento).toISOString(),
      gustos: data.gustos?.map((g: any) => g.name) || [],
      alergias: data.alergias?.map((a: any) => a.name) || [],
      patologias: data.patologias?.map((p: any) => p.name) || [],
    };
  
    console.log("Datos a enviar en edición:", pacienteActualizado);
  
    try {
      const response = await fetch(`/api/pacientes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pacienteActualizado),
      });
  
      if (!response.ok) throw new Error("Error al actualizar paciente");
  
      toast.success("✅ Paciente actualizado con éxito!");
      setTimeout(() => router.push("/dashboard/pacientes"), 1500);
    } catch (error) {
      setErrorMessage("❌ No se pudo actualizar el paciente.");
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleNextStep = async () => {
    let camposRequeridos: string[] = [];

    if (step === 1) {
      camposRequeridos = [
        "nombre",
        "fechaNacimiento",
        "genero",
        "telefono",
        "email",
        "peso",
        "altura",
      ];
    } else if (step === 2) {
      camposRequeridos = ["objetivoCorto", "actividad", "aguaDiaria"];
    }

    const isStepValid = await trigger(camposRequeridos);
    if (isStepValid) {
      setStep(step + 1);
    }
  };

  const handlePreviousStep = () => {
    setStep(step - 1);
  };

  if (loading)
    return (
      <p className="text-center text-gray-600">
        Cargando datos del paciente...
      </p>
    );

  return (
    <div className="max-w-5xl mx-auto p-8 bg-gray-50 shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
        ✏️ Editar Paciente
      </h1>

      {/* Barra de progreso */}
      <ProgressBar step={step} />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {step === 1 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 shadow-md rounded-lg">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">
                  🧑‍⚕️ Datos Básicos
                </h2>
                <DatosBasicos register={register} errors={errors} />
              </div>
              <div className="bg-white p-6 shadow-md rounded-lg">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">
                  💉 Datos Clínicos
                </h2>
                <DatosClinicos
                  register={register}
                  errors={errors}
                  watch={watch}
                  control={control}
                />
              </div>
            </div>
            <button
              type="button"
              onClick={handleNextStep}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-md transition-all duration-300"
            >
              Siguiente →
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <EstiloVida
              register={register}
              errors={errors}

            />
            <ObjetivosNutricionales register={register} errors={errors} />
            <div className="flex justify-between space-x-4">
              <button
                type="button"
                onClick={handlePreviousStep}
                className="w-1/2 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 rounded-md"
              >
                ← Anterior
              </button>
              <button
                type="button"
                onClick={handleNextStep}
                className="w-1/2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-md transition-all duration-300"
              >
                Siguiente →
              </button>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <PreferenciasAlimenticias
              register={register}
              errors={errors}
              control={control}
            />
            <ObservacionesAdicionales register={register} errors={errors} />
            <div className="flex justify-between space-x-4">
              <button
                type="button"
                onClick={handlePreviousStep}
                className="w-1/2 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 rounded-md"
              >
                ← Anterior
              </button>
              <button
                type="submit"
                className="w-1/2 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-md"
              >
                {isSaving ? "Guardando..." : "✅ Guardar Cambios"}
              </button>
            </div>
          </>
        )}
      </form>

      {errorMessage && (
        <p className="text-red-600 font-semibold mt-4">{errorMessage}</p>
      )}
    </div>
  );
}
