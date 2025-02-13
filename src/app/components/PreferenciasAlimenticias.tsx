import { UseFormRegister, FieldErrors, useFieldArray, Control } from "react-hook-form";
import { Info, PlusCircle, Trash2 } from "lucide-react";

interface Props {
  register: UseFormRegister<any>;
  errors: FieldErrors;
  control: Control<any>;
}

export default function PreferenciasAlimenticias({ register, errors, control }: Props) {
  // Lista de gustos y preferencias
  const { fields: gustos, append: agregarGusto, remove: eliminarGusto } = useFieldArray({
    control,
    name: "gustos",
  });

  // Lista de alergias e intolerancias
  const { fields: alergias, append: agregarAlergia, remove: eliminarAlergia } = useFieldArray({
    control,
    name: "alergias",
  });

  return (
    <div>
      <h2 className="text-lg font-bold">Preferencias alimenticias</h2>

      {/* 🔹 Gustos y preferencias - Lista dinámica */}
      <div className="relative group">
        <div className="flex items-center gap-2">
          <label htmlFor="gustos" className="text-sm font-medium text-gray-700 cursor-pointer">
            Gustos y preferencias
          </label>
          <Info className="w-4 h-4 text-gray-500 cursor-pointer group-hover:text-blue-500" />
        </div>

        <div className="flex gap-2 mt-2">
          <input id="nuevoGusto" type="text" className="border p-2 rounded-md w-full" placeholder="Ejemplo: Verduras, Carnes, Frutas" />
          <button
            type="button"
            onClick={() => {
              const input = document.getElementById("nuevoGusto") as HTMLInputElement;
              if (input.value.trim()) {
                agregarGusto({ id: Date.now().toString(), name: input.value });
                input.value = "";
              }
            }}
            className="text-blue-500 hover:text-blue-700"
          >
            <PlusCircle className="w-6 h-6" />
          </button>
        </div>

        <ul className="mt-2">
          {gustos.map((gusto, index) => (
            <li key={gusto.id} className="flex items-center justify-between text-sm text-gray-700 border-b py-1">
              {gusto.name}
              <button onClick={() => eliminarGusto(index)} className="text-red-500 hover:text-red-700">
                <Trash2 className="w-4 h-4" />
              </button>
            </li>
          ))}
        </ul>

        <span className="absolute left-0 -top-10 hidden w-auto p-2 text-xs text-white bg-gray-800 rounded-md opacity-0 group-hover:block group-hover:opacity-100">
          Ejemplo: Verduras, Carnes, Frutas
        </span>
      </div>

      {/* 🔹 Intolerancias o alergias alimentarias - Lista dinámica */}
      <div className="relative group mt-4">
        <div className="flex items-center gap-2">
          <label htmlFor="alergias" className="text-sm font-medium text-gray-700 cursor-pointer">
            Intolerancias o alergias alimentarias
          </label>
          <Info className="w-4 h-4 text-gray-500 cursor-pointer group-hover:text-blue-500" />
        </div>

        <div className="flex gap-2 mt-2">
          <input id="nuevaAlergia" type="text" className="border p-2 rounded-md w-full" placeholder="Ejemplo: Gluten, Lactosa, Maní" />
          <button
            type="button"
            onClick={() => {
              const input = document.getElementById("nuevaAlergia") as HTMLInputElement;
              if (input.value.trim()) {
                agregarAlergia({ id: Date.now().toString(), name: input.value });
                input.value = "";
              }
            }}
            className="text-blue-500 hover:text-blue-700"
          >
            <PlusCircle className="w-6 h-6" />
          </button>
        </div>

        <ul className="mt-2">
          {alergias.map((alergia, index) => (
            <li key={alergia.id} className="flex items-center justify-between text-sm text-gray-700 border-b py-1">
              {alergia.name}
              <button onClick={() => eliminarAlergia(index)} className="text-red-500 hover:text-red-700">
                <Trash2 className="w-4 h-4" />
              </button>
            </li>
          ))}
        </ul>

        <span className="absolute left-0 -top-10 hidden w-auto p-2 text-xs text-white bg-gray-800 rounded-md opacity-0 group-hover:block group-hover:opacity-100">
          Ejemplo: Gluten, Lactosa, Maní
        </span>
      </div>
    </div>
  );
}
