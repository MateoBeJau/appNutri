"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import DatosBasicos from "./DatosBasicos";
import DatosClinicos from "./DatosClinicos";
import ObjetivosNutricionales from "./ObjetivosNutricionales";
import EstiloVida from "./EstiloVida";
import PreferenciasAlimenticias from "./PreferenciasAlimenticias";
import ObservacionesAdicionales from "./ObservacionesAdicionales";
import { ProgressBar } from "./progress-bar";

export default function PacienteForm() {
  const [step, setStep] = useState<number>(1);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
    trigger,
    reset,
    control,
  } = useForm({
    mode: "onChange",
  });

  const onSubmit = (data: any) => {
    console.log("Datos del paciente enviados:", data);
    setSuccessMessage("✅ Paciente guardado con éxito!");
    setTimeout(() => setSuccessMessage(null), 3000);
    reset();
    setStep(1);
  };

  const handleNextStep = async () => {
    let camposRequeridos: string[] = [];

    if (step === 1) {
      camposRequeridos = ["nombre", "fechaNacimiento", "genero", "telefono", "email", "peso", "altura"];
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

  return (
    <div className="max-w-5xl mx-auto p-8 bg-gray-50 shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">📋 Registro de Paciente</h1>

      {/* Barra de progreso */}
      <ProgressBar step={step} />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {step === 1 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 shadow-md rounded-lg">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">🧑‍⚕️ Datos Básicos</h2>
                <DatosBasicos register={register} errors={errors} />
              </div>
              <div className="bg-white p-6 shadow-md rounded-lg">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">💉 Datos Clínicos</h2>
                <DatosClinicos register={register} errors={errors} watch={watch} control={control} />
              </div>
            </div>
            <button
              type="button"
              onClick={handleNextStep}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-md transition-all duration-300 disabled:opacity-50"
              disabled={!isValid}
            >
              Siguiente →
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 shadow-md rounded-lg">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">🎯 Objetivos Nutricionales</h2>
                <EstiloVida register={register} errors={errors} />
                
              </div>
              <div className="bg-white p-6 shadow-md rounded-lg">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">🏋️ Estilo de Vida</h2>
                <ObjetivosNutricionales register={register} errors={errors} />
              </div>
            </div>
            <div className="flex justify-between space-x-4">
              <button
                type="button"
                onClick={handlePreviousStep}
                className="w-1/2 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 rounded-md transition-all duration-300"
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 shadow-md rounded-lg">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">🍽️ Preferencias Alimenticias</h2>
                <PreferenciasAlimenticias register={register} errors={errors} control={control} />
              </div>
              <div className="bg-white p-6 shadow-md rounded-lg">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">📝 Observaciones Adicionales</h2>
                <ObservacionesAdicionales register={register} errors={errors} />
              </div>
            </div>
            <div className="flex justify-between space-x-4">
              <button
                type="button"
                onClick={handlePreviousStep}
                className="w-1/2 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 rounded-md transition-all duration-300"
              >
                ← Anterior
              </button>
              <button
                type="submit"
                className="w-1/2 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-md transition-all duration-300"
              >
                ✅ Guardar Paciente
              </button>
            </div>
          </>
        )}
      </form>

      {/* Mensaje de éxito */}
      {successMessage && (
        <div className="mt-6 text-center text-green-600 text-lg font-semibold animate-fade-in">
          {successMessage}
        </div>
      )}

      {/* Visualización de datos ingresados */}
      <div className="mt-10 p-6 bg-white rounded-md shadow-md">
        <h2 className="text-lg font-semibold text-gray-700">👀 Vista previa de los datos</h2>
        <pre className="mt-2 text-sm text-gray-600 bg-gray-200 p-4 rounded-md overflow-auto">
          {JSON.stringify(watch(), null, 2)}
        </pre>
      </div>
    </div>
  );
}
