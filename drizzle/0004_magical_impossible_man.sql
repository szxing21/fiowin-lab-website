ALTER TABLE `members` MODIFY COLUMN `role` enum('PI','Postdoc','PhD','Master','Undergraduate','Alumni','Member') NOT NULL;--> statement-breakpoint
ALTER TABLE `members` ADD `identity` varchar(128);--> statement-breakpoint
ALTER TABLE `members` ADD `grade` varchar(128);