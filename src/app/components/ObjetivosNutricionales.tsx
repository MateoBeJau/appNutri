import FormField from "@/app/components/FormField";
import { UseFormRegister, FieldErrors } from "react-hook-form";

interface Props {
  register: UseFormRegister<any>;
  errors: FieldErrors;
}

export default function ObjetivosNutricionales({ register, errors }: Props) {
  return (
    <div>


      {/* Objetivo a corto plazo - Select con opciones válidas */}
      <FormField
        label="Objetivo a corto plazo"
        type="select"
        id="objetivoCorto"
        register={register}
        errors={errors}
        rules={{
          required: "Debe seleccionar un objetivo a corto plazo",
        }}
        options={[
          { value: "mantener_peso", label: "Mantener peso" },
          { value: "bajar_peso", label: "Bajar peso" },
          { value: "subir_peso", label: "Subir peso" },
          { value: "aumentar_masa_muscular", label: "Aumentar masa muscular" },
          { value: "mejorar_rendimiento", label: "Mejorar rendimiento deportivo" },
          { value: "otro", label: "Otro (especificar en notas)" },
        ]}
      />

      {/* Objetivo a largo plazo - Textarea con validaciones */}
      <FormField
        label="Objetivo a largo plazo"
        type="textarea"
        id="objetivoLargo"
        register={register}
        errors={errors}
        rules={{
          required: "Debe escribir un objetivo a largo plazo",
          minLength: {
            value: 10,
            message: "El objetivo debe tener al menos 10 caracteres",
          },
          maxLength: {
            value: 500,
            message: "El objetivo no puede superar los 500 caracteres",
          },
        }}
      />
    </div>
  );
}
