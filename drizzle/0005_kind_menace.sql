ALTER TABLE `members` ADD `birthday` varchar(32);--> statement-breakpoint
ALTER TABLE `members` ADD `contact` varchar(128);--> statement-breakpoint
ALTER TABLE `members` DROP COLUMN `identity`;--> statement-breakpoint
ALTER TABLE `members` DROP COLUMN `grade`;