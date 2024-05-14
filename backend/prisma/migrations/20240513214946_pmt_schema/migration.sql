/*
  Warnings:

  - You are about to drop the column `roleId` on the `Role` table. All the data in the column will be lost.
  - You are about to drop the `_PermissionToRole` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Role" DROP CONSTRAINT "Role_roleId_fkey";

-- DropForeignKey
ALTER TABLE "_PermissionToRole" DROP CONSTRAINT "_PermissionToRole_A_fkey";

-- DropForeignKey
ALTER TABLE "_PermissionToRole" DROP CONSTRAINT "_PermissionToRole_B_fkey";

-- AlterTable
ALTER TABLE "Permission" ADD COLUMN     "roleId" INTEGER;

-- AlterTable
ALTER TABLE "Role" DROP COLUMN "roleId";

-- DropTable
DROP TABLE "_PermissionToRole";

-- AddForeignKey
ALTER TABLE "Permission" ADD CONSTRAINT "Permission_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE SET NULL ON UPDATE CASCADE;
