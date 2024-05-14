/*
  Warnings:

  - Added the required column `roleId` to the `Role` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Role" ADD COLUMN     "roleId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Role" ADD CONSTRAINT "Role_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
