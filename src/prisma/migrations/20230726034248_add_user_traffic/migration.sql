-- CreateTable
CREATE TABLE "user_traffic" (
    "id" SERIAL NOT NULL,
    "app" VARCHAR(50),
    "version" VARCHAR(50),
    "env" VARCHAR(50),
    "source" VARCHAR(50),
    "user_agent" VARCHAR(1000),
    "ip" VARCHAR(50),
    "area" VARCHAR(255),
    "longitude" DOUBLE PRECISION,
    "latitude" DOUBLE PRECISION,
    "altitude" DOUBLE PRECISION,
    "enter_at" TIMESTAMPTZ(3),
    "leave_at" TIMESTAMPTZ(3),
    "duration" INTEGER,
    "user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(3) DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER,
    "updated_at" TIMESTAMPTZ(3),
    "updated_by" INTEGER,
    "deleted_at" TIMESTAMPTZ(3),
    "deleted_by" INTEGER,

    CONSTRAINT "user_traffic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "traffic_record" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255),
    "url" VARCHAR(1000),
    "path" VARCHAR(1000),
    "enter_at" TIMESTAMPTZ(3),
    "leave_at" TIMESTAMPTZ(3),
    "duration" INTEGER,
    "user_traffic_id" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(3) DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER,
    "updated_at" TIMESTAMPTZ(3),
    "updated_by" INTEGER,
    "deleted_at" TIMESTAMPTZ(3),
    "deleted_by" INTEGER,

    CONSTRAINT "traffic_record_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "user_traffic" ADD CONSTRAINT "user_traffic_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "system_user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "traffic_record" ADD CONSTRAINT "traffic_record_user_traffic_id_fkey" FOREIGN KEY ("user_traffic_id") REFERENCES "user_traffic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
