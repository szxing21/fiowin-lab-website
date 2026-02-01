CREATE TABLE `pages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(128) NOT NULL,
	`title` varchar(256) NOT NULL,
	`contentHtml` text,
	`contentJson` text,
	`description` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `pages_id` PRIMARY KEY(`id`),
	CONSTRAINT `pages_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
ALTER TABLE `members` ADD `education` text;--> statement-breakpoint
ALTER TABLE `members` ADD `workExperience` text;--> statement-breakpoint
ALTER TABLE `members` ADD `projects` text;--> statement-breakpoint
ALTER TABLE `members` ADD `researchAreas` text;--> statement-breakpoint
ALTER TABLE `members` ADD `personalWebsite` varchar(512);--> statement-breakpoint
ALTER TABLE `members` ADD `googleScholar` varchar(512);--> statement-breakpoint
ALTER TABLE `members` ADD `github` varchar(512);--> statement-breakpoint
ALTER TABLE `members` ADD `orcid` varchar(128);