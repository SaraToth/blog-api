/*
  Warnings:

  - Added the required column `status` to the `posts` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."postStatus" AS ENUM ('PUBLISHED', 'DRAFT');

-- AlterTable
ALTER TABLE "public"."posts" ADD COLUMN     "status" "public"."postStatus" NOT NULL;
