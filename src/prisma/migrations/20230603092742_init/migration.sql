-- CreateEnum
CREATE TYPE "gender" AS ENUM ('undefined', 'male', 'female');

-- CreateEnum
CREATE TYPE "system_role" AS ENUM ('admin', 'user', 'editor', 'advertiser');

-- CreateEnum
CREATE TYPE "audit_status" AS ENUM ('pending', 'approved', 'rejected');

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

-- CreateTable
CREATE TABLE "news" (
    "id" SERIAL NOT NULL,
    "uuid" VARCHAR(1000) NOT NULL,
    "title" VARCHAR(1000) NOT NULL,
    "description" VARCHAR(1500),
    "content" VARCHAR(1500) NOT NULL,
    "banner_url" VARCHAR(1000),
    "audit_status" "audit_status" NOT NULL DEFAULT 'pending',
    "audit_by" VARCHAR(255),
    "home_recommended" BOOLEAN NOT NULL DEFAULT false,
    "carousel_recommended" BOOLEAN NOT NULL DEFAULT false,
    "flow_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(3) DEFAULT CURRENT_TIMESTAMP,
    "created_by" VARCHAR(255),
    "updated_at" TIMESTAMPTZ(3),
    "updated_by" VARCHAR(255),
    "deleted_at" TIMESTAMPTZ(3),
    "deleted_by" VARCHAR(255),
    "user_id" INTEGER NOT NULL,
    "user_uuid" VARCHAR(1000) NOT NULL,
    "category_id" INTEGER NOT NULL,
    "category_uuid" VARCHAR(1000) NOT NULL,
    "tag_id" INTEGER NOT NULL,
    "tag_uuid" VARCHAR(1000) NOT NULL,

    CONSTRAINT "news_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "advertisement" (
    "id" SERIAL NOT NULL,
    "uuid" VARCHAR(1000) NOT NULL,
    "created_at" TIMESTAMPTZ(3) DEFAULT CURRENT_TIMESTAMP,
    "created_by" VARCHAR(255),
    "updated_at" TIMESTAMPTZ(3),
    "updated_by" VARCHAR(255),
    "deleted_at" TIMESTAMPTZ(3),
    "deleted_by" VARCHAR(255),
    "user_id" INTEGER NOT NULL,
    "user_uuid" VARCHAR(1000) NOT NULL,

    CONSTRAINT "advertisement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "category" (
    "id" SERIAL NOT NULL,
    "uuid" VARCHAR(1000) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(3) DEFAULT CURRENT_TIMESTAMP,
    "created_by" VARCHAR(255),
    "updated_at" TIMESTAMPTZ(3),
    "updated_by" VARCHAR(255),
    "deleted_at" TIMESTAMPTZ(3),
    "deleted_by" VARCHAR(255),

    CONSTRAINT "category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tag" (
    "id" SERIAL NOT NULL,
    "uuid" VARCHAR(1000) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(3) DEFAULT CURRENT_TIMESTAMP,
    "created_by" VARCHAR(255),
    "updated_at" TIMESTAMPTZ(3),
    "updated_by" VARCHAR(255),
    "deleted_at" TIMESTAMPTZ(3),
    "deleted_by" VARCHAR(255),

    CONSTRAINT "tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "like" (
    "id" SERIAL NOT NULL,
    "uuid" VARCHAR(1000) NOT NULL,
    "created_at" TIMESTAMPTZ(3) DEFAULT CURRENT_TIMESTAMP,
    "created_by" VARCHAR(255),
    "updated_at" TIMESTAMPTZ(3),
    "updated_by" VARCHAR(255),
    "deleted_at" TIMESTAMPTZ(3),
    "deleted_by" VARCHAR(255),
    "new_id" INTEGER NOT NULL,
    "new_uuid" VARCHAR(1000) NOT NULL,
    "user_id" INTEGER NOT NULL,
    "user_uuid" VARCHAR(1000) NOT NULL,

    CONSTRAINT "like_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "star" (
    "id" SERIAL NOT NULL,
    "uuid" VARCHAR(1000) NOT NULL,
    "created_at" TIMESTAMPTZ(3) DEFAULT CURRENT_TIMESTAMP,
    "created_by" VARCHAR(255),
    "updated_at" TIMESTAMPTZ(3),
    "updated_by" VARCHAR(255),
    "deleted_at" TIMESTAMPTZ(3),
    "deleted_by" VARCHAR(255),
    "new_id" INTEGER NOT NULL,
    "new_uuid" VARCHAR(1000) NOT NULL,
    "user_id" INTEGER NOT NULL,
    "user_uuid" VARCHAR(1000) NOT NULL,

    CONSTRAINT "star_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comment" (
    "id" SERIAL NOT NULL,
    "uuid" VARCHAR(1000) NOT NULL,
    "message" VARCHAR(2000) NOT NULL,
    "created_at" TIMESTAMPTZ(3) DEFAULT CURRENT_TIMESTAMP,
    "created_by" VARCHAR(255),
    "updated_at" TIMESTAMPTZ(3),
    "updated_by" VARCHAR(255),
    "deleted_at" TIMESTAMPTZ(3),
    "deleted_by" VARCHAR(255),
    "new_id" INTEGER NOT NULL,
    "new_uuid" VARCHAR(1000) NOT NULL,
    "user_id" INTEGER NOT NULL,
    "user_uuid" VARCHAR(1000) NOT NULL,

    CONSTRAINT "comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "visit_record" (
    "id" SERIAL NOT NULL,
    "uuid" VARCHAR(1000) NOT NULL,
    "created_at" TIMESTAMPTZ(3) DEFAULT CURRENT_TIMESTAMP,
    "created_by" VARCHAR(255),
    "updated_at" TIMESTAMPTZ(3),
    "updated_by" VARCHAR(255),
    "deleted_at" TIMESTAMPTZ(3),
    "deleted_by" VARCHAR(255),
    "new_id" INTEGER NOT NULL,
    "new_uuid" VARCHAR(1000) NOT NULL,
    "user_id" INTEGER NOT NULL,
    "user_uuid" VARCHAR(1000) NOT NULL,

    CONSTRAINT "visit_record_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_uuid_key" ON "user"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "user_username_key" ON "user"("username");

-- CreateIndex
CREATE UNIQUE INDEX "setting_uuid_key" ON "setting"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "setting_key_key" ON "setting"("key");

-- CreateIndex
CREATE UNIQUE INDEX "news_uuid_key" ON "news"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "advertisement_uuid_key" ON "advertisement"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "category_uuid_key" ON "category"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "category_name_key" ON "category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "tag_uuid_key" ON "tag"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "tag_name_key" ON "tag"("name");

-- CreateIndex
CREATE UNIQUE INDEX "like_uuid_key" ON "like"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "star_uuid_key" ON "star"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "comment_uuid_key" ON "comment"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "visit_record_uuid_key" ON "visit_record"("uuid");

-- AddForeignKey
ALTER TABLE "news" ADD CONSTRAINT "news_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "news" ADD CONSTRAINT "news_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "news" ADD CONSTRAINT "news_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "advertisement" ADD CONSTRAINT "advertisement_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "like" ADD CONSTRAINT "like_new_id_fkey" FOREIGN KEY ("new_id") REFERENCES "news"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "like" ADD CONSTRAINT "like_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "star" ADD CONSTRAINT "star_new_id_fkey" FOREIGN KEY ("new_id") REFERENCES "news"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "star" ADD CONSTRAINT "star_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment" ADD CONSTRAINT "comment_new_id_fkey" FOREIGN KEY ("new_id") REFERENCES "news"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment" ADD CONSTRAINT "comment_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visit_record" ADD CONSTRAINT "visit_record_new_id_fkey" FOREIGN KEY ("new_id") REFERENCES "news"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visit_record" ADD CONSTRAINT "visit_record_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
