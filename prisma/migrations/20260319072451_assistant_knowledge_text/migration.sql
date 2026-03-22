/*
  Warnings:

  - Made the column `question` on table `assistant_knowledge` required. This step will fail if there are existing NULL values in that column.
  - Made the column `answer` on table `assistant_knowledge` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `assistant_knowledge` MODIFY `question` TEXT NOT NULL,
    MODIFY `answer` TEXT NOT NULL;
