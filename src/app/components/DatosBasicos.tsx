import FormField from "@/app/components/FormField";
import { UseFormRegister, FieldErrors } from "react-hook-form";

interface Props {
  register: UseFormRegister<any>;
  errors: FieldErrors;
}

export default function DatosBasicos({ register, errors }: Props) {
  return (
    <div>
      

      {/* Nombre completo - Solo letras, mínimo 2 caracteres */}
      <FormField
        label="Nombre completo"
        type="text"
        id="nombre"
        register={register}
        errors={errors}
        rules={{
          required: "El nombre es obligatorio",
          pattern: {
            value: /^[a-zA-ZÀ-ÿ\s]+$/,
            message: "Solo se permiten letras",
          },
          minLength: {
            value: 2,
            message: "Debe tener al menos 2 caracteres",
          },
        }}
      />

      {/* Fecha de nacimiento - Debe ser una fecha válida en el pasado */}
      <FormField
        label="Fecha de nacimiento"
        type="date"
        id="fechaNacimiento"
        register={register}
        errors={errors}
        rules={{
          required: "La fecha de nacimiento es obligatoria",
          validate: (value) => {
            const fechaIngresada = new Date(value);
            const fechaActual = new Date();
            return fechaIngresada < fechaActual || "Debe ser una fecha en el pasado";
          },
        }}
      />

      {/* Género - Campo obligatorio */}
      <FormField
        label="Género"
        type="select"
        id="genero"
        register={register}
        errors={errors}
        rules={{ required: "Seleccione un género" }}
        options={[
          { value: "masculino", label: "Masculino" },
          { value: "femenino", label: "Femenino" },
          { value: "otro", label: "Otro" },
        ]}
      />

      {/* Teléfono de contacto - Solo números, entre 8 y 15 dígitos */}
      <FormField
        label="Teléfono de contacto"
        type="text"
        id="telefono"
        register={register}
        errors={errors}
        rules={{
          required: "El teléfono es obligatorio",
          pattern: {
            value: /^[0-9]{8,15}$/,
            message: "El teléfono debe tener entre 8 y 15 dígitos",
          },
        }}
      />

      {/* Correo electrónico - Validación con regex */}
      <FormField
        label="Correo electrónico"
        type="email"
        id="email"
        register={register}
        errors={errors}
        rules={{
          required: "El correo es obligatorio",
          pattern: {
            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            message: "El correo no es válido",
          },
        }}
      />
    </div>
  );
}
