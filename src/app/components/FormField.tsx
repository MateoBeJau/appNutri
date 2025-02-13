import React from "react";
import { UseFormRegister, FieldErrors, RegisterOptions } from "react-hook-form";

// Definición de las propiedades del componente
type FormFieldProps = {
  label: string; // Texto del label
  type: "date" | "number" | "text" | "email" | "password" | "textarea" | "select" | "checkbox" | "radio"; // Tipos soportados
  register: UseFormRegister<any>; // Función register de React Hook Form
  id: string; // Identificador del campo
  errors?: FieldErrors; // Errores del formulario
  options?: { value: string; label: string }[]; // Opciones para selects o radios
  rules?: RegisterOptions; // Reglas de validación personalizadas
  placeholder?: string;
  
};

const FormField: React.FC<FormFieldProps> = ({
  label,
  type,
  register,
  id,
  errors,
  options,
  rules = {},
  placeholder,
  
}) => {
  // Clases comunes para los inputs de texto, email, password y number
  const inputClassName =
    "w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500";

  // Validaciones predeterminadas según el tipo de campo
  const defaultValidationRules: RegisterOptions = ["text", "email", "password", "textarea"].includes(type)
    ? {
        required: `${label} es obligatorio`,
        minLength: type === "text" ? { value: 2, message: `${label} debe tener al menos 2 caracteres` } : undefined,
        maxLength: type === "text" ? { value: 50, message: `${label} debe tener un máximo de 50 caracteres` } : undefined,
        ...rules, // Mezcla las reglas personalizadas con las predeterminadas
      }
    : ["number"].includes(type)
    ? {
        required: `${label} es obligatorio`,
        min: { value: 0, message: "Debe ser un número positivo" },
        ...rules,
      }
    : rules;

  return (
    <div className="mb-4">
      {/* Etiqueta del campo (no se muestra para checkboxes porque su label va a la derecha) */}
      {type !== "checkbox" && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}

      {/* Campo de tipo Textarea */}
      {type === "textarea" && (
        <textarea id={id} {...register(id, defaultValidationRules)} className={inputClassName} 
        placeholder={placeholder}></textarea>
      )}

      {/* Campo de tipo Select con opciones dinámicas */}
      {type === "select" && options && (
        <select id={id} {...register(id, defaultValidationRules)} className={inputClassName}>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )}

      {/* Campo de tipo Checkbox */}
      {type === "checkbox" && (
        <div className="flex items-center">
          <input
            type="checkbox"
            id={id}
            {...register(id, defaultValidationRules)}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor={id} className="ml-2 block text-sm text-gray-700">{label}</label>
        </div>
      )}

      {/* Campo de tipo Radio con opciones dinámicas */}
      {type === "radio" && options && (
        <div>
          {options.map((option) => (
            <div key={option.value} className="flex items-center mb-2">
              <input
                type="radio"
                id={`${id}-${option.value}`}
                value={option.value}
                {...register(id, defaultValidationRules)}
                className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <label htmlFor={`${id}-${option.value}`} className="ml-2 block text-sm text-gray-700">
                {option.label}
              </label>
            </div>
          ))}
        </div>
      )}

      {/* Campos de tipo Texto, Email y Password */}
      {["text", "email", "password"].includes(type) && (
        <input type={type} id={id} {...register(id, defaultValidationRules)} className={inputClassName} />
      )}

      {/* Campo de tipo Number */}
      {type === "number" && (
        <input
          type="number"
          id={id}
          {...register(id, defaultValidationRules)}
          className={inputClassName}
          placeholder={placeholder}
        />
      )}

      {/* Campo de tipo Date */}
      {type === "date" && (
        <input
          type="date"
          id={id}
          {...register(id, defaultValidationRules)}
          className={inputClassName}
        />
      )}

      {/* Mensaje de error si existe alguna validación fallida */}
      {errors?.[id] && typeof errors[id]?.message === "string" && (
        <p className="text-red-500 text-xs mt-1">{errors[id]?.message}</p>
      )}
    </div>
  );
};

export default FormField;
