/*
  Warnings:

  - Added the required column `date` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endereco` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `horario` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `local` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "endereco" TEXT NOT NULL,
ADD COLUMN     "horario" TEXT NOT NULL,
ADD COLUMN     "local" TEXT NOT NULL;
