-- CreateEnum
CREATE TYPE "gender" AS ENUM ('undefined', 'male', 'female');

-- CreateEnum
CREATE TYPE "system_role" AS ENUM ('admin', 'user');

-- CreateEnum
CREATE TYPE "auth_type" AS ENUM ('github', 'google', 'kv');

-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "uuid" VARCHAR(1000) NOT NULL,
    "username" VARCHAR(100) NOT NULL,
    "email" VARCHAR(255),
    "password" VARCHAR(100) NOT NULL,
    "name" VARCHAR(1000),
    "first_name" VARCHAR(255),
    "last_name" VARCHAR(500),
    "gender" "gender" DEFAULT 'undefined',
    "phone_number" VARCHAR(100),
    "birth_date" DATE,
    "address" VARCHAR(1500),
    "avatar_url" VARCHAR(1000),
    "biography" VARCHAR(1500),
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "system_roles" "system_role"[] DEFAULT ARRAY['user']::"system_role"[],
    "created_at" TIMESTAMPTZ(3) DEFAULT CURRENT_TIMESTAMP,
    "created_by" VARCHAR(255),
    "updated_at" TIMESTAMPTZ(3),
    "updated_by" VARCHAR(255),
    "deleted_at" TIMESTAMPTZ(3),
    "deleted_by" VARCHAR(255),

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth" (
    "id" SERIAL NOT NULL,
    "uuid" VARCHAR(1000) NOT NULL,
    "auth_type" "auth_type" NOT NULL,
    "access_token" TEXT NOT NULL,
    "open_id" VARCHAR(1000),
    "secret_key" VARCHAR(1000),
    "secret_value" VARCHAR(1000),
    "expires_at" TIMESTAMPTZ(3) NOT NULL,
    "created_at" TIMESTAMPTZ(3) DEFAULT CURRENT_TIMESTAMP,
    "created_by" VARCHAR(255),
    "updated_at" TIMESTAMPTZ(3),
    "updated_by" VARCHAR(255),
    "deleted_at" TIMESTAMPTZ(3),
    "deleted_by" VARCHAR(255),
    "user_id" INTEGER NOT NULL,
    "user_uuid" VARCHAR(1000) NOT NULL,

    CONSTRAINT "auth_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "setting" (
    "id" SERIAL NOT NULL,
    "uuid" VARCHAR(1000) NOT NULL,
    "key" VARCHAR(1000) NOT NULL,
    "value" JSON,
    "description" VARCHAR(1500),
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(3) DEFAULT CURRENT_TIMESTAMP,
    "created_by" VARCHAR(255),
    "updated_at" TIMESTAMPTZ(3),
    "updated_by" VARCHAR(255),
    "deleted_at" TIMESTAMPTZ(3),
    "deleted_by" VARCHAR(255),

    CONSTRAINT "setting_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_uuid_key" ON "user"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "user_username_key" ON "user"("username");

-- CreateIndex
CREATE UNIQUE INDEX "auth_uuid_key" ON "auth"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "setting_uuid_key" ON "setting"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "setting_key_key" ON "setting"("key");

-- AddForeignKey
ALTER TABLE "auth" ADD CONSTRAINT "auth_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
