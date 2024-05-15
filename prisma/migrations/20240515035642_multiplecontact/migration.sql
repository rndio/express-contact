/*
  Warnings:

  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the `project_categories` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `project_techstacks` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `projects` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `techstacks` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `user_id` to the `contacts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `project_techstacks` DROP FOREIGN KEY `project_techstacks_project_id_fkey`;

-- DropForeignKey
ALTER TABLE `project_techstacks` DROP FOREIGN KEY `project_techstacks_techstack_id_fkey`;

-- DropForeignKey
ALTER TABLE `projects` DROP FOREIGN KEY `projects_category_id_fkey`;

-- AlterTable
ALTER TABLE `contacts` ADD COLUMN `user_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `users` DROP PRIMARY KEY,
    ADD COLUMN `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- DropTable
DROP TABLE `project_categories`;

-- DropTable
DROP TABLE `project_techstacks`;

-- DropTable
DROP TABLE `projects`;

-- DropTable
DROP TABLE `techstacks`;

-- AddForeignKey
ALTER TABLE `contacts` ADD CONSTRAINT `contacts_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
