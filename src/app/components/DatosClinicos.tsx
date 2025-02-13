import { UseFormRegister, FieldErrors, useFieldArray, Control } from "react-hook-form";
import FormField from "@/app/components/FormField";
import { Info, PlusCircle, Trash2 } from "lucide-react";

interface Props {
  register: UseFormRegister<any>;
  errors: FieldErrors;
  control: Control<any>; // Necesario para manejar listas dinámicas con react-hook-form
  watch: any;
}

export default function DatosClinicos({ register, errors, control, watch }: Props) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "patologias", // Guardará las patologías dentro del formulario
  });

  const peso = watch("peso");
  const altura = watch("altura");

  // Calcular IMC solo si ambos valores están presentes
  const imc = peso && altura ? (peso / (altura / 100) ** 2).toFixed(2) : "";

  return (
    <div>

      {/* Lista dinámica de patologías */}
      <div className="relative group">
        <div className="flex items-center gap-2">
          <label htmlFor="patologias" className="text-sm font-medium text-gray-700 cursor-pointer">
            Antecedentes personales (patologías)
          </label>
          <Info className="w-4 h-4 text-gray-500 cursor-pointer group-hover:text-blue-500" />
        </div>

        <div className="flex gap-2 mt-2">
          <input id="nuevaPatologia" type="text" className="border p-2 rounded-md w-full" placeholder="Ejemplo: Diabetes, Hipertensión" />
          <button
            type="button"
            onClick={() => {
              const input = document.getElementById("nuevaPatologia") as HTMLInputElement;
              if (input.value.trim()) {
                append({ id: Date.now().toString(), name: input.value }); // Agregar correctamente con ID
                input.value = "";
              }
            }}
            className="text-blue-500 hover:text-blue-700"
          >
            <PlusCircle className="w-6 h-6" />
          </button>
        </div>

        {/* Lista de patologías */}
        <ul className="mt-2">
          {fields.map((field, index) => (
            <li key={field.id} className="flex items-center justify-between text-sm text-gray-700 border-b py-1">
              {field.name ?? "Sin nombre"} {/* Asegurar que siempre tenga un valor */}
              <button onClick={() => remove(index)} className="text-red-500 hover:text-red-700">
                <Trash2 className="w-4 h-4" />
              </button>
            </li>
          ))}
        </ul>

        <span className="absolute left-0 -top-10 hidden w-auto p-2 text-xs text-white bg-gray-800 rounded-md opacity-0 group-hover:block group-hover:opacity-100">
          Ejemplo: Diabetes, Hipertensión, Asma
        </span>
      </div>

      {/* Campo de peso con validaciones */}
      <FormField
        label="Peso actual (kg)"
        type="number"
        id="peso"
        register={register}
        errors={errors}
        rules={{
          required: "El peso es obligatorio",
          min: { value: 40, message: "Debe ser un peso razonable (40kg mínimo)" },
          max: { value: 200, message: "Debe ser un peso razonable (200kg máximo)" },
        }}
        placeholder="Ejemplo: 70"
      />

      {/* Campo de altura con validaciones */}
      <FormField
        label="Altura (cm)"
        type="number"
        id="altura"
        register={register}
        errors={errors}
        rules={{
          required: "La altura es obligatoria",
          min: { value: 100, message: "Debe ser una altura razonable (mínimo 100 cm)" },
          max: { value: 230, message: "Debe ser una altura razonable (máximo 230 cm)" },
        }}
        placeholder="Ejemplo: 175"
      />

      {/* IMC calculado automáticamente */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">IMC (Índice de Masa Corporal)</label>
        <input
          type="text"
          value={imc}
          readOnly
          className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
        />
      </div>
    </div>
  );
}
