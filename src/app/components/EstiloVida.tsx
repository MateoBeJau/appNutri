import FormField from "@/app/components/FormField";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { Info } from "lucide-react"; // Importamos el ícono de exclamación

interface Props {
  register: UseFormRegister<any>;
  errors: FieldErrors;
}

export default function EstiloVida({ register, errors }: Props) {
  return (
    <div>
     

      {/* Horarios de comidas */}
      <div className="relative group">
        <div className="flex items-center gap-2">
          <label htmlFor="horariosComida" className="text-sm font-medium text-gray-700 cursor-pointer">
            Horarios de comidas
          </label>
          <Info className="w-4 h-4 text-gray-500 cursor-pointer group-hover:text-blue-500" />
        </div>

        <FormField
          type="textarea"
          id="horariosComida"
          register={register}
          errors={errors}
          rules={{
            required: "Debe especificar los horarios de comidas",
            minLength: { value: 10, message: "Debe describir los horarios con más detalle" },
            maxLength: { value: 500, message: "Máximo 500 caracteres" },
          }}
          placeholder="Ejemplo: Desayuno 7:30 AM, Almuerzo 12:30 PM, Cena 8:00 PM" label={""}        />

        <span className="absolute left-0 -top-10 hidden w-auto p-2 text-xs text-white bg-gray-800 rounded-md opacity-0 group-hover:block group-hover:opacity-100">
          Ejemplo: Desayuno 7:30 AM, Almuerzo 12:30 PM, Cena 8:00 PM
        </span>
      </div>

      {/* Tiempos de trabajo */}
      <div className="relative group">
        <div className="flex items-center gap-2">
          <label htmlFor="tiemposTrabajo" className="text-sm font-medium text-gray-700 cursor-pointer">
            Tiempos de trabajo
          </label>
          <Info className="w-4 h-4 text-gray-500 cursor-pointer group-hover:text-blue-500" />
        </div>

        <FormField
          type="textarea"
          id="tiemposTrabajo"
          register={register}
          errors={errors}
          rules={{
            required: "Debe especificar los tiempos de trabajo",
            minLength: { value: 10, message: "Debe describir los tiempos de trabajo con más detalle" },
            maxLength: { value: 300, message: "Máximo 300 caracteres" },
          }}
          placeholder="Ejemplo: Trabajo de 9 AM a 6 PM, con descanso de 1 PM a 2 PM" label={""}        />

        <span className="absolute left-0 -top-10 hidden w-auto p-2 text-xs text-white bg-gray-800 rounded-md opacity-0 group-hover:block group-hover:opacity-100">
          Ejemplo: Trabajo de 9 AM a 6 PM, con descanso de 1 PM a 2 PM
        </span>
      </div>

      {/* Frecuencia de entrenamiento */}
      <FormField
        label="Frecuencia de entrenamiento"
        type="select"
        id="frecuenciaEntrenamiento"
        register={register}
        errors={errors}
        rules={{
          required: "Debe seleccionar una frecuencia de entrenamiento",
        }}
        options={[
          { value: "ninguno", label: "No realiza ejercicio" },
          { value: "diaria", label: "Diaria" },
          { value: "3_4_semanal", label: "3-4 veces por semana" },
          { value: "ocasional", label: "Ocasionalmente" },
          { value: "competitivo", label: "Entrenamiento para competencia" },
        ]}
      />

      {/* Consumo de agua diario */}
      <FormField
        label="Consumo de agua diario (litros)"
        type="number"
        id="aguaDiaria"
        register={register}
        errors={errors}
        rules={{
          required: "Debe ingresar el consumo de agua",
          min: { value: 0.5, message: "Debe ser al menos 0.5 litros" },
          max: { value: 10, message: "Debe ser menor a 10 litros" },
        }}
        placeholder="Ejemplo: 2.5"
      />

      {/* Consumo de alcohol o tabaco */}
      <div className="relative group">
        <div className="flex items-center gap-2">
          <label htmlFor="consumoAlcoholTabaco" className="text-sm font-medium text-gray-700 cursor-pointer">
            Consumo de alcohol o tabaco
          </label>
          <Info className="w-4 h-4 text-gray-500 cursor-pointer group-hover:text-blue-500" />
        </div>

        <FormField
          type="textarea"
          id="consumoAlcoholTabaco"
          register={register}
          errors={errors}
          rules={{
            maxLength: { value: 300, message: "Máximo 300 caracteres" },
          }}
          placeholder="Ejemplo: Consumo ocasional de alcohol los fines de semana" label={""}        />

        <span className="absolute left-0 -top-10 hidden w-auto p-2 text-xs text-white bg-gray-800 rounded-md opacity-0 group-hover:block group-hover:opacity-100">
          Ejemplo: Consumo ocasional de alcohol los fines de semana
        </span>
      </div>

      {/* Horas de sueño */}
      <FormField
        label="Sueño diario (horas)"
        type="number"
        id="horasSueno"
        register={register}
        errors={errors}
        rules={{
          required: "Debe ingresar la cantidad de horas de sueño",
          min: { value: 3, message: "Debe ser al menos 3 horas" },
          max: { value: 12, message: "No puede ser mayor a 12 horas" },
        }}
        placeholder="Ejemplo: 7"
      />
    </div>
  );
}
