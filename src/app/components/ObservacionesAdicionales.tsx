import FormField from "@/app/components/FormField";
import { UseFormRegister, FieldErrors } from "react-hook-form";

interface Props {
  register: UseFormRegister<any>;
  errors: FieldErrors;
}

export default function ObservacionesAdicionales({ register, errors }: Props) {
  return (
    <div>

      <FormField label="Notas del nutricionista" type="textarea" id="notas" register={register} errors={errors} />
    </div>
  );
}
