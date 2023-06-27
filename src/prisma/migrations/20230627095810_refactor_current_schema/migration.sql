/*
  Warnings:

  - The values [kv] on the enum `auth_type` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `access_token` on the `auth` table. All the data in the column will be lost.
  - You are about to drop the column `open_id` on the `auth` table. All the data in the column will be lost.
  - You are about to drop the column `secret_key` on the `auth` table. All the data in the column will be lost.
  - You are about to drop the column `secret_value` on the `auth` table. All the data in the column will be lost.
  - You are about to drop the column `user_uuid` on the `auth` table. All the data in the column will be lost.
  - You are about to drop the column `uuid` on the `auth` table. All the data in the column will be lost.
  - The `created_by` column on the `auth` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `updated_by` column on the `auth` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `deleted_by` column on the `auth` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `uuid` on the `setting` table. All the data in the column will be lost.
  - You are about to alter the column `key` on the `setting` table. The data in that column could be lost. The data in that column will be cast from `VarChar(1000)` to `VarChar(255)`.
  - The `created_by` column on the `setting` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `updated_by` column on the `setting` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `deleted_by` column on the `setting` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `system_roles` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `uuid` on the `user` table. All the data in the column will be lost.
  - You are about to alter the column `username` on the `user` table. The data in that column could be lost. The data in that column will be cast from `VarChar(100)` to `VarChar(20)`.
  - You are about to alter the column `email` on the `user` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(30)`.
  - You are about to alter the column `name` on the `user` table. The data in that column could be lost. The data in that column will be cast from `VarChar(1000)` to `VarChar(20)`.
  - You are about to alter the column `last_name` on the `user` table. The data in that column could be lost. The data in that column will be cast from `VarChar(500)` to `VarChar(255)`.
  - The `gender` column on the `user` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to alter the column `phone_number` on the `user` table. The data in that column could be lost. The data in that column will be cast from `VarChar(100)` to `VarChar(20)`.
  - You are about to alter the column `address` on the `user` table. The data in that column could be lost. The data in that column will be cast from `VarChar(1500)` to `VarChar(255)`.
  - The `created_by` column on the `user` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `updated_by` column on the `user` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `deleted_by` column on the `user` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[email]` on the table `user` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `token` to the `auth` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "auth_type_new" AS ENUM ('github', 'google');
ALTER TABLE "auth" ALTER COLUMN "auth_type" TYPE "auth_type_new" USING ("auth_type"::text::"auth_type_new");
ALTER TYPE "auth_type" RENAME TO "auth_type_old";
ALTER TYPE "auth_type_new" RENAME TO "auth_type";
DROP TYPE "auth_type_old";
COMMIT;

-- DropIndex
DROP INDEX "auth_uuid_key";

-- DropIndex
DROP INDEX "setting_uuid_key";

-- DropIndex
DROP INDEX "user_uuid_key";

-- AlterTable
ALTER TABLE "auth" DROP COLUMN "access_token",
DROP COLUMN "open_id",
DROP COLUMN "secret_key",
DROP COLUMN "secret_value",
DROP COLUMN "user_uuid",
DROP COLUMN "uuid",
ADD COLUMN     "token" VARCHAR(255) NOT NULL,
ALTER COLUMN "expires_at" DROP NOT NULL,
DROP COLUMN "created_by",
ADD COLUMN     "created_by" INTEGER,
DROP COLUMN "updated_by",
ADD COLUMN     "updated_by" INTEGER,
DROP COLUMN "deleted_by",
ADD COLUMN     "deleted_by" INTEGER;

-- AlterTable
ALTER TABLE "setting" DROP COLUMN "uuid",
ALTER COLUMN "key" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "description" SET DATA TYPE TEXT,
DROP COLUMN "created_by",
ADD COLUMN     "created_by" INTEGER,
DROP COLUMN "updated_by",
ADD COLUMN     "updated_by" INTEGER,
DROP COLUMN "deleted_by",
ADD COLUMN     "deleted_by" INTEGER;

-- AlterTable
ALTER TABLE "user" DROP COLUMN "system_roles",
DROP COLUMN "uuid",
ADD COLUMN     "city" VARCHAR(50),
ADD COLUMN     "country" VARCHAR(50),
ADD COLUMN     "nick_name" VARCHAR(255),
ADD COLUMN     "province" VARCHAR(50),
ALTER COLUMN "username" SET DATA TYPE VARCHAR(20),
ALTER COLUMN "email" SET DATA TYPE VARCHAR(30),
ALTER COLUMN "password" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "name" SET DATA TYPE VARCHAR(20),
ALTER COLUMN "last_name" SET DATA TYPE VARCHAR(255),
DROP COLUMN "gender",
ADD COLUMN     "gender" VARCHAR(10),
ALTER COLUMN "phone_number" SET DATA TYPE VARCHAR(20),
ALTER COLUMN "address" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "biography" SET DATA TYPE TEXT,
DROP COLUMN "created_by",
ADD COLUMN     "created_by" INTEGER,
DROP COLUMN "updated_by",
ADD COLUMN     "updated_by" INTEGER,
DROP COLUMN "deleted_by",
ADD COLUMN     "deleted_by" INTEGER;

-- DropEnum
DROP TYPE "gender";

-- DropEnum
DROP TYPE "system_role";

-- CreateTable
CREATE TABLE "role" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(3) DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER,
    "updated_at" TIMESTAMPTZ(3),
    "updated_by" INTEGER,
    "deleted_at" TIMESTAMPTZ(3),
    "deleted_by" INTEGER,
    "name" VARCHAR(50) NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "user_id" INTEGER,

    CONSTRAINT "role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permission" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(3) DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER,
    "updated_at" TIMESTAMPTZ(3),
    "updated_by" INTEGER,
    "deleted_at" TIMESTAMPTZ(3),
    "deleted_by" INTEGER,
    "name" VARCHAR(50) NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "role_id" INTEGER,

    CONSTRAINT "permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "menu" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(3) DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER,
    "updated_at" TIMESTAMPTZ(3),
    "updated_by" INTEGER,
    "deleted_at" TIMESTAMPTZ(3),
    "deleted_by" INTEGER,
    "name" VARCHAR(50) NOT NULL,
    "key" VARCHAR(50) NOT NULL,
    "path_url" VARCHAR(255),
    "lang_key" VARCHAR(255),
    "icon_key" VARCHAR(50),
    "type" INTEGER,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER,
    "remark" TEXT,
    "parent_id" INTEGER,
    "permission_id" INTEGER,

    CONSTRAINT "menu_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "role_name_key" ON "role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "permission_name_key" ON "permission"("name");

-- CreateIndex
CREATE UNIQUE INDEX "menu_name_key" ON "menu"("name");

-- CreateIndex
CREATE UNIQUE INDEX "menu_key_key" ON "menu"("key");

-- CreateIndex
CREATE UNIQUE INDEX "menu_path_url_key" ON "menu"("path_url");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- AddForeignKey
ALTER TABLE "role" ADD CONSTRAINT "role_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "permission" ADD CONSTRAINT "permission_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "menu" ADD CONSTRAINT "menu_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "menu"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "menu" ADD CONSTRAINT "menu_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "permission"("id") ON DELETE SET NULL ON UPDATE CASCADE;
