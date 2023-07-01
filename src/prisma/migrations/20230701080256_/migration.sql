-- CreateTable
CREATE TABLE "system_user" (
    "id" SERIAL NOT NULL,
    "username" VARCHAR(30) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "email" VARCHAR(30),
    "phone_number" VARCHAR(20),
    "name" VARCHAR(30),
    "first_name" VARCHAR(30),
    "last_name" VARCHAR(30),
    "nick_name" VARCHAR(50),
    "avatar_url" VARCHAR(1000),
    "gender" INTEGER,
    "country" VARCHAR(50),
    "province" VARCHAR(50),
    "city" VARCHAR(50),
    "address" TEXT,
    "biography" TEXT,
    "birth_date" DATE,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(3) DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER,
    "updated_at" TIMESTAMPTZ(3),
    "updated_by" INTEGER,
    "deleted_at" TIMESTAMPTZ(3),
    "deleted_by" INTEGER,

    CONSTRAINT "system_user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_auth" (
    "id" SERIAL NOT NULL,
    "auth_type" INTEGER NOT NULL,
    "token" VARCHAR(255) NOT NULL,
    "expires_at" TIMESTAMPTZ(3),
    "user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(3) DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER,
    "updated_at" TIMESTAMPTZ(3),
    "updated_by" INTEGER,
    "deleted_at" TIMESTAMPTZ(3),
    "deleted_by" INTEGER,

    CONSTRAINT "system_auth_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_role" (
    "id" SERIAL NOT NULL,
    "key" VARCHAR(50) NOT NULL,
    "name_en" VARCHAR(50),
    "name_zh" VARCHAR(50),
    "is_built_in" BOOLEAN NOT NULL DEFAULT false,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(3) DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER,
    "updated_at" TIMESTAMPTZ(3),
    "updated_by" INTEGER,
    "deleted_at" TIMESTAMPTZ(3),
    "deleted_by" INTEGER,

    CONSTRAINT "system_role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_user_role" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "roleId" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(3) DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER,
    "updated_at" TIMESTAMPTZ(3),
    "updated_by" INTEGER,
    "deleted_at" TIMESTAMPTZ(3),
    "deleted_by" INTEGER,

    CONSTRAINT "system_user_role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_permission" (
    "id" SERIAL NOT NULL,
    "key" VARCHAR(50) NOT NULL,
    "name_en" VARCHAR(50),
    "name_zh" VARCHAR(50),
    "is_built_in" BOOLEAN NOT NULL DEFAULT false,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(3) DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER,
    "updated_at" TIMESTAMPTZ(3),
    "updated_by" INTEGER,
    "deleted_at" TIMESTAMPTZ(3),
    "deleted_by" INTEGER,

    CONSTRAINT "system_permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_role_permission" (
    "id" SERIAL NOT NULL,
    "roleId" INTEGER NOT NULL,
    "permissionId" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(3) DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER,
    "updated_at" TIMESTAMPTZ(3),
    "updated_by" INTEGER,
    "deleted_at" TIMESTAMPTZ(3),
    "deleted_by" INTEGER,

    CONSTRAINT "system_role_permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_setting" (
    "id" SERIAL NOT NULL,
    "key" VARCHAR(255) NOT NULL,
    "value" JSON,
    "description" TEXT,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(3) DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER,
    "updated_at" TIMESTAMPTZ(3),
    "updated_by" INTEGER,
    "deleted_at" TIMESTAMPTZ(3),
    "deleted_by" INTEGER,

    CONSTRAINT "system_setting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_menu_item" (
    "id" SERIAL NOT NULL,
    "key" VARCHAR(50) NOT NULL,
    "name_en" VARCHAR(50),
    "name_zh" VARCHAR(50),
    "url" VARCHAR(255),
    "icon" VARCHAR(50),
    "type" INTEGER,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER DEFAULT 0,
    "remark" TEXT,
    "parent_id" INTEGER,
    "permission_id" INTEGER,
    "created_at" TIMESTAMPTZ(3) DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER,
    "updated_at" TIMESTAMPTZ(3),
    "updated_by" INTEGER,
    "deleted_at" TIMESTAMPTZ(3),
    "deleted_by" INTEGER,

    CONSTRAINT "system_menu_item_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "system_user_username_key" ON "system_user"("username");

-- CreateIndex
CREATE UNIQUE INDEX "system_user_email_key" ON "system_user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "system_role_key_key" ON "system_role"("key");

-- CreateIndex
CREATE UNIQUE INDEX "system_permission_key_key" ON "system_permission"("key");

-- CreateIndex
CREATE UNIQUE INDEX "system_setting_key_key" ON "system_setting"("key");

-- CreateIndex
CREATE UNIQUE INDEX "system_menu_item_key_key" ON "system_menu_item"("key");

-- AddForeignKey
ALTER TABLE "system_auth" ADD CONSTRAINT "system_auth_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "system_user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "system_user_role" ADD CONSTRAINT "system_user_role_userId_fkey" FOREIGN KEY ("userId") REFERENCES "system_user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "system_user_role" ADD CONSTRAINT "system_user_role_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "system_role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "system_role_permission" ADD CONSTRAINT "system_role_permission_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "system_role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "system_role_permission" ADD CONSTRAINT "system_role_permission_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "system_permission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "system_menu_item" ADD CONSTRAINT "system_menu_item_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "system_menu_item"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "system_menu_item" ADD CONSTRAINT "system_menu_item_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "system_permission"("id") ON DELETE SET NULL ON UPDATE CASCADE;
