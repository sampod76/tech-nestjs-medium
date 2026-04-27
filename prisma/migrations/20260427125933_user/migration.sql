-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "auth";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "common";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "media";

-- CreateEnum
CREATE TYPE "auth"."UserGender" AS ENUM ('male', 'female', 'other');

-- CreateEnum
CREATE TYPE "common"."FileCategory" AS ENUM ('image', 'video', 'audio', 'document', 'pdf', 'other');

-- CreateEnum
CREATE TYPE "common"."StorageProvider" AS ENUM ('aws', 'cloudinary', 'server');

-- CreateEnum
CREATE TYPE "common"."RecordStatus" AS ENUM ('active', 'inactive', 'blocked', 'archived');

-- CreateEnum
CREATE TYPE "auth"."TokenType" AS ENUM ('login', 'reset_password', 'account_create');

-- CreateEnum
CREATE TYPE "auth"."UserRole" AS ENUM ('superAdmin', 'admin', 'b2c', 'b2b', 'guest');

-- CreateEnum
CREATE TYPE "auth"."VerificationStatus" AS ENUM ('pending', 'approved', 'rejected');

-- CreateEnum
CREATE TYPE "auth"."AccountType" AS ENUM ('custom', 'google', 'apple', 'facebook', 'twitter', 'github', 'linkedin', 'instagram');

-- CreateEnum
CREATE TYPE "auth"."AssignBy" AS ENUM ('admin', 'b2b', 'b2c');

-- CreateTable
CREATE TABLE "auth"."admin" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "gender" "auth"."UserGender" NOT NULL DEFAULT 'male',
    "phone" VARCHAR(255),
    "address" VARCHAR(255),
    "dob" TEXT,
    "image_id" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "media"."files" (
    "id" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "mimetype" TEXT NOT NULL,
    "size" INTEGER NOT NULL DEFAULT 0,
    "storage" "common"."StorageProvider" NOT NULL DEFAULT 'aws',
    "path" TEXT NOT NULL,
    "url" TEXT,
    "file_key" TEXT NOT NULL,
    "category" "common"."FileCategory" NOT NULL DEFAULT 'image',
    "entity_id" TEXT,
    "entity_type" TEXT,
    "is_primary" BOOLEAN NOT NULL DEFAULT false,
    "is_public" BOOLEAN NOT NULL DEFAULT true,
    "title" TEXT,
    "caption" TEXT,
    "metadata" JSONB,
    "deleted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth"."user_tokens" (
    "id" TEXT NOT NULL,
    "otp" INTEGER NOT NULL,
    "jwtToken" TEXT,
    "timeOut" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "user_id" TEXT,
    "resetToken" TEXT,
    "token_type" "auth"."TokenType",

    CONSTRAINT "user_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth"."temp_users" (
    "id" TEXT NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "user_type" "auth"."UserRole" NOT NULL,
    "token_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "temp_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth"."users" (
    "id" TEXT NOT NULL,
    "userUniqueId" VARCHAR(255),
    "email" VARCHAR(255) NOT NULL,
    "password" TEXT,
    "user_type" "auth"."UserRole" DEFAULT 'guest',
    "username" VARCHAR(255) NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "is_email_verified" BOOLEAN NOT NULL DEFAULT false,
    "is_online" BOOLEAN NOT NULL DEFAULT false,
    "is_change_password" BOOLEAN NOT NULL DEFAULT false,
    "is_main_account" BOOLEAN NOT NULL DEFAULT true,
    "verification_status" "auth"."VerificationStatus" DEFAULT 'pending',
    "status" "common"."RecordStatus" DEFAULT 'active',
    "account_type" "auth"."AccountType" DEFAULT 'custom',
    "providerId" TEXT,
    "secret_key" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "last_login" TIMESTAMP(6),
    "author_id" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admin_user_id_key" ON "auth"."admin"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "admin_image_id_key" ON "auth"."admin"("image_id");

-- CreateIndex
CREATE UNIQUE INDEX "files_file_key_key" ON "media"."files"("file_key");

-- CreateIndex
CREATE INDEX "files_entity_type_entity_id_is_primary_idx" ON "media"."files"("entity_type", "entity_id", "is_primary");

-- CreateIndex
CREATE INDEX "files_deleted_at_created_at_idx" ON "media"."files"("deleted_at", "created_at");

-- CreateIndex
CREATE INDEX "user_tokens_is_deleted_idx" ON "auth"."user_tokens"("is_deleted");

-- CreateIndex
CREATE UNIQUE INDEX "users_userUniqueId_key" ON "auth"."users"("userUniqueId");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "auth"."users"("username");

-- CreateIndex
CREATE INDEX "users_username_is_deleted_idx" ON "auth"."users"("username", "is_deleted");

-- CreateIndex
CREATE UNIQUE INDEX "users_user_type_email_key" ON "auth"."users"("user_type", "email");

-- AddForeignKey
ALTER TABLE "auth"."admin" ADD CONSTRAINT "admin_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auth"."admin" ADD CONSTRAINT "admin_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "media"."files"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auth"."user_tokens" ADD CONSTRAINT "user_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auth"."temp_users" ADD CONSTRAINT "temp_users_token_id_fkey" FOREIGN KEY ("token_id") REFERENCES "auth"."user_tokens"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auth"."users" ADD CONSTRAINT "users_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "auth"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
