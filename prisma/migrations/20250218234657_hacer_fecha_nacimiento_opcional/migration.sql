/*
  Warnings:

  - The `fechaNacimiento` column on the `Paciente` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Paciente" ADD COLUMN     "aguaDiaria" DOUBLE PRECISION,
ADD COLUMN     "consumoAlcoholTabaco" TEXT,
ADD COLUMN     "frecuenciaEntrenamiento" TEXT,
ADD COLUMN     "horariosComida" TEXT,
ADD COLUMN     "horasSueno" DOUBLE PRECISION,
ADD COLUMN     "notas" TEXT,
ADD COLUMN     "objetivoCorto" TEXT,
ADD COLUMN     "objetivoLargo" TEXT,
ADD COLUMN     "patologias" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "tiemposTrabajo" TEXT,
DROP COLUMN "fechaNacimiento",
ADD COLUMN     "fechaNacimiento" TIMESTAMP(3),
ALTER COLUMN "gustos" SET DEFAULT ARRAY[]::TEXT[],
ALTER COLUMN "alergias" SET DEFAULT ARRAY[]::TEXT[];
