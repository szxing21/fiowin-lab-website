-- Add personal page fields to members table
ALTER TABLE `members` ADD COLUMN `education` text;
ALTER TABLE `members` ADD COLUMN `workExperience` text;
ALTER TABLE `members` ADD COLUMN `projects` text;
ALTER TABLE `members` ADD COLUMN `researchAreas` text;
ALTER TABLE `members` ADD COLUMN `personalWebsite` varchar(512);
ALTER TABLE `members` ADD COLUMN `googleScholar` varchar(512);
ALTER TABLE `members` ADD COLUMN `github` varchar(512);
ALTER TABLE `members` ADD COLUMN `orcid` varchar(128);
